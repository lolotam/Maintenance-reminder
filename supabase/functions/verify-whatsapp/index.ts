
import { createClient } from '@supabase/supabase-js'
import { Twilio } from "npm:twilio"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { phoneNumber } = await req.json()

    if (!phoneNumber) {
      throw new Error('Phone number is required')
    }

    const twilioClient = new Twilio(
      Deno.env.get('TWILIO_SID'),
      Deno.env.get('TWILIO_TOKEN')
    )

    const verification = await twilioClient.verify.v2
      .services(Deno.env.get('TWILIO_SERVICE_SID'))
      .verifications.create({
        to: phoneNumber,
        channel: 'whatsapp'
      })

    return new Response(
      JSON.stringify({ success: true, sid: verification.sid }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
