
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
    
    // Get user profile to get email
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single();
    
    if (profileError || !profile || !profile.email) {
      throw new Error(`Profile not found or no email: ${profileError?.message || 'No email in profile'}`);
    }
    
    // Record this test notification in the database
    const { data: notification, error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type: "email",
        status: "sent",
        sent_at: new Date().toISOString(),
        content: { 
          subject: "Test Email Notification", 
          body: "This is a test email notification from your hospital equipment maintenance app."
        },
      })
      .select()
      .single();
    
    if (notificationError) {
      console.error("Error creating notification record:", notificationError);
    }
    
    console.log(`Test email notification would be sent to ${profile.email}`);
    
    return new Response(JSON.stringify({ success: true, email: profile.email }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Error sending test email:", errorMessage);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
