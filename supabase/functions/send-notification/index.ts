
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create a single Supabase client for the function
const supabaseUrl = "https://fxrsuzsypswseotxzeei.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { notificationId, type, machineId } = await req.json();
    
    if (!notificationId || !type) {
      throw new Error("Missing required parameters: notificationId or type");
    }
    
    // First, get the notification from the database to ensure it exists
    const { data: notification, error: notificationError } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", notificationId)
      .single();
    
    if (notificationError || !notification) {
      throw new Error(`Notification not found: ${notificationError?.message || 'unknown error'}`);
    }
    
    // Get machine details
    let machine;
    if (machineId) {
      const { data: machineData, error: machineError } = await supabase
        .from("machines")
        .select("*")
        .eq("id", machineId)
        .single();
      
      if (machineError) {
        console.error("Error fetching machine:", machineError);
      } else {
        machine = machineData;
      }
    }
    
    // Get user profile to get notification settings
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", notification.user_id)
      .single();
    
    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }
    
    // Send notification based on type
    let success = false;
    let error = null;
    
    switch (type) {
      case "email":
        // Here we would call the email service
        // For now, simulate success
        success = true;
        break;
        
      case "whatsapp":
        if (!profile?.whatsapp_number) {
          throw new Error("WhatsApp number not found in profile");
        }
        
        // Here we would use Twilio API to send WhatsApp
        // For demonstration, use the existing Twilio secret
        const twilioAccountSid = Deno.env.get("TWILIO_SID");
        const twilioAuthToken = Deno.env.get("TWILIO_TOKEN");
        const twilioPhone = Deno.env.get("TWILIO_PHONE");
        
        if (!twilioAccountSid || !twilioAuthToken || !twilioPhone) {
          throw new Error("Twilio credentials not configured");
        }
        
        // For demo purposes - normally we'd implement the actual Twilio API call
        console.log("Would send WhatsApp message via Twilio to:", profile.whatsapp_number);
        success = true;
        break;
        
      case "push":
        // Get subscriptions for user
        const { data: subscriptions, error: subError } = await supabase
          .from("push_notification_subscriptions")
          .select("*")
          .eq("user_id", notification.user_id);
          
        if (subError) {
          throw subError;
        }
        
        if (!subscriptions || subscriptions.length === 0) {
          throw new Error("No push subscriptions found for user");
        }
        
        // In a real implementation, here we would use web-push to send notifications
        // For now, log the subscriptions and simulate success
        console.log(`Would send push to ${subscriptions.length} subscriptions`);
        success = true;
        break;
        
      case "sms":
        // Similar to WhatsApp, would use Twilio for SMS
        success = true;
        break;
        
      default:
        throw new Error(`Unsupported notification type: ${type}`);
    }
    
    // Update notification status
    await supabase
      .from("notifications")
      .update({
        status: success ? "sent" : "failed",
        sent_at: success ? new Date().toISOString() : null,
      })
      .eq("id", notificationId);
    
    return new Response(JSON.stringify({ success }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Error processing notification:", errorMessage);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
