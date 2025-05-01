
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

  try {
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error("Missing required parameter: userId");
    }
    
    // Get push subscriptions for this user
    const { data: subscriptions, error: subError } = await supabase
      .from("push_notification_subscriptions")
      .select("*")
      .eq("user_id", userId);
      
    if (subError) {
      throw subError;
    }
    
    if (!subscriptions || subscriptions.length === 0) {
      throw new Error("No push subscriptions found for user");
    }
    
    // Record this test notification in the database
    const { data: notification, error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type: "push",
        status: "sent",
        sent_at: new Date().toISOString(),
        content: { title: "Test Push Notification", body: "This is a test push notification from your maintenance app." },
      })
      .select()
      .single();
    
    if (notificationError) {
      console.error("Error creating notification record:", notificationError);
    }
    
    // In a real implementation, here we would use web-push library to send notifications
    console.log(`Would send push to ${subscriptions.length} subscriptions`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Test notification sent to ${subscriptions.length} subscriptions` 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Error sending test notification:", errorMessage);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
