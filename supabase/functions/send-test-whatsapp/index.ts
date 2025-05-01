
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
    
    // Get user profile to get WhatsApp number
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("whatsapp_number")
      .eq("id", userId)
      .single();
    
    if (profileError || !profile || !profile.whatsapp_number) {
      throw new Error(`Profile not found or no WhatsApp number: ${profileError?.message || 'No WhatsApp number in profile'}`);
    }
    
    // Record this test notification in the database
    const { data: notification, error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type: "whatsapp",
        status: "sent",
        sent_at: new Date().toISOString(),
        content: { message: "This is a test WhatsApp notification from your hospital equipment maintenance app." },
      })
      .select()
      .single();
    
    if (notificationError) {
      console.error("Error creating notification record:", notificationError);
    }
    
    // In a real implementation, here we would use Twilio API to send WhatsApp message
    console.log(`Test WhatsApp notification would be sent to ${profile.whatsapp_number}`);
    
    return new Response(JSON.stringify({ success: true, number: profile.whatsapp_number }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Error sending test WhatsApp message:", errorMessage);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
