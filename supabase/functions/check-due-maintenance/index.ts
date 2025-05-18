
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

// Create a single Supabase client for the function
const supabaseUrl = "https://fxrsuzsypswseotxzeei.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  try {
    // This function is intended to be called by a cron job
    
    // Get all machines with next_maintenance_date within the next month
    // that are still pending maintenance (status not marked as maintained)
    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setDate(now.getDate() + 30);
    
    // Query for PPM machines that are pending
    const { data: ppmMachines, error: ppmError } = await supabase
      .from("machines")
      .select(`
        id, 
        name, 
        next_maintenance_date, 
        user_id,
        last_maintenance_date,
        location,
        equipment_type
      `)
      .eq("equipment_type", "PPM")
      .is("last_maintenance_date", null)
      .lte("next_maintenance_date", oneMonthFromNow.toISOString())
      .gte("next_maintenance_date", now.toISOString());
      
    if (ppmError) {
      throw ppmError;
    }
    
    // Query for OCM machines that are pending
    const { data: ocmMachines, error: ocmError } = await supabase
      .from("machines")
      .select(`
        id, 
        name, 
        next_maintenance_date, 
        user_id,
        last_maintenance_date,
        location,
        equipment_type
      `)
      .eq("equipment_type", "OCM")
      .is("last_maintenance_date", null)
      .lte("next_maintenance_date", oneMonthFromNow.toISOString())
      .gte("next_maintenance_date", now.toISOString());
      
    if (ocmError) {
      throw ocmError;
    }
    
    // Combine both types of machines
    const pendingMachines = [...(ppmMachines || []), ...(ocmMachines || [])];
    
    console.log(`Found ${pendingMachines.length} pending machines due for maintenance`);
    
    // For each machine, check user notification preferences and send reminders
    const results = await Promise.all(pendingMachines.map(async (machine) => {
      try {
        // Get user profile to see notification preferences
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("notification_settings, email, whatsapp_number")
          .eq("id", machine.user_id)
          .single();
          
        if (profileError || !profile) {
          console.error("Error getting user profile:", profileError || "Profile not found");
          return { machine: machine.id, success: false, error: "Profile not found" };
        }
        
        const settings = profile.notification_settings || {};
        const reminderDays = settings.reminder_days || [30, 14, 7, 3, 1];
        
        // Calculate days until maintenance
        const maintenanceDate = new Date(machine.next_maintenance_date);
        const daysUntil = Math.ceil((maintenanceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        // Only send notification if this is one of the reminder days
        if (!reminderDays.includes(daysUntil)) {
          return { machine: machine.id, success: true, skipped: true, reason: "Not a reminder day" };
        }
        
        // Check if we've already sent a notification for this day
        const dayStart = new Date(now);
        dayStart.setHours(0, 0, 0, 0);
        
        const { data: existingNotifications, error: notifError } = await supabase
          .from("notifications")
          .select("id")
          .eq("machine_id", machine.id)
          .eq("status", "sent")
          .gte("sent_at", dayStart.toISOString())
          .limit(1);
          
        if (notifError) {
          console.error("Error checking existing notifications:", notifError);
          return { machine: machine.id, success: false, error: notifError.message };
        }
        
        if (existingNotifications && existingNotifications.length > 0) {
          return { 
            machine: machine.id, 
            success: true, 
            skipped: true, 
            reason: "Already notified today" 
          };
        }
        
        // Create notification record
        const { data: notification, error: notificationError } = await supabase
          .from("notifications")
          .insert({
            user_id: machine.user_id,
            machine_id: machine.id,
            type: "system",
            status: "pending",
            content: {
              message: `Maintenance for ${machine.name} in ${machine.location} is due in ${daysUntil} days`,
              machineType: machine.equipment_type,
              daysUntil,
              maintenanceDate: machine.next_maintenance_date,
            },
          })
          .select()
          .single();
          
        if (notificationError) {
          console.error("Error creating notification:", notificationError);
          return { machine: machine.id, success: false, error: notificationError.message };
        }
        
        // Call the notification service to send various types of notifications
        const sendEmailNotification = settings.email !== false && profile.email;
        const sendWhatsappNotification = settings.whatsapp === true && profile.whatsapp_number;
        const sendPushNotification = settings.push !== false;
        
        // Track which notifications were sent
        const notificationsSent = [];
        
        // Send email notification
        if (sendEmailNotification) {
          try {
            const { data: emailResult } = await supabase.functions.invoke("send-notification", {
              body: {
                notificationId: notification.id,
                type: "email",
                machineId: machine.id
              }
            });
            
            if (emailResult?.success) {
              notificationsSent.push("email");
            }
          } catch (error) {
            console.error(`Error sending email for machine ${machine.id}:`, error);
          }
        }
        
        // Send WhatsApp notification
        if (sendWhatsappNotification) {
          try {
            const { data: whatsappResult } = await supabase.functions.invoke("send-notification", {
              body: {
                notificationId: notification.id,
                type: "whatsapp",
                machineId: machine.id
              }
            });
            
            if (whatsappResult?.success) {
              notificationsSent.push("whatsapp");
            }
          } catch (error) {
            console.error(`Error sending WhatsApp for machine ${machine.id}:`, error);
          }
        }
        
        // Send push notification
        if (sendPushNotification) {
          try {
            const { data: pushResult } = await supabase.functions.invoke("send-notification", {
              body: {
                notificationId: notification.id,
                type: "push",
                machineId: machine.id
              }
            });
            
            if (pushResult?.success) {
              notificationsSent.push("push");
            }
          } catch (error) {
            console.error(`Error sending push notification for machine ${machine.id}:`, error);
          }
        }
        
        // Update notification status based on what was sent
        if (notificationsSent.length > 0) {
          await supabase
            .from("notifications")
            .update({
              status: "sent",
              sent_at: now.toISOString(),
              content: {
                ...notification.content,
                notificationsSent
              }
            })
            .eq("id", notification.id);
            
          return { 
            machine: machine.id, 
            success: true, 
            notificationId: notification.id,
            notificationsSent
          };
        } else {
          await supabase
            .from("notifications")
            .update({
              status: "failed",
              content: {
                ...notification.content,
                error: "No notification methods were successfully sent"
              }
            })
            .eq("id", notification.id);
            
          return { 
            machine: machine.id, 
            success: false, 
            notificationId: notification.id,
            error: "Failed to send any notifications"
          };
        }
        
      } catch (err) {
        console.error(`Error processing machine ${machine.id}:`, err);
        return { machine: machine.id, success: false, error: err instanceof Error ? err.message : "Unknown error" };
      }
    }));
    
    return new Response(JSON.stringify({ 
      success: true, 
      machinesChecked: pendingMachines.length,
      results 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Error checking due maintenance:", errorMessage);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
