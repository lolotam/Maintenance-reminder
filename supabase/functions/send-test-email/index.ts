
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();
    
    if (!email) {
      throw new Error("Missing required parameter: email");
    }
    
    // Setup SMTP client with credentials from environment variables
    const client = new SMTPClient({
      connection: {
        hostname: Deno.env.get("SMTP_HOST") || "smtp.gmail.com",
        port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
        tls: true,
        auth: {
          username: Deno.env.get("SMTP_USERNAME") || "",
          password: Deno.env.get("SMTP_PASSWORD") || "",
        },
      },
    });

    // Send test email
    await client.send({
      from: Deno.env.get("SMTP_USERNAME") || "",
      to: email,
      subject: "Test Email from Hospital Equipment Maintenance System",
      content: `
        <html>
          <body>
            <h1>Test Email Notification</h1>
            <p>Hello ${name || "there"},</p>
            <p>This is a test email from your Hospital Equipment Maintenance System.</p>
            <p>If you received this email, your notification settings are working correctly.</p>
            <hr>
            <p><em>This is an automated message, please do not reply.</em></p>
          </body>
        </html>
      `,
      html: true,
    });
    
    await client.close();
    
    console.log(`Test email sent to ${email}`);
    
    return new Response(JSON.stringify({ success: true, email }), {
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
