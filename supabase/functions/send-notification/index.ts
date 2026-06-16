import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    const supabase = authHeader
      ? createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        )
      : createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        )

    const { type, recipientEmail, payload, schoolId } = await req.json() as {
      type: string
      recipientEmail: string
      payload: Record<string, unknown>
      schoolId?: string
    }

    await supabase.from('notification_log').insert({
      school_id: schoolId ?? null,
      recipient_email: recipientEmail,
      notification_type: type,
      payload,
      status: 'stubbed',
    })

    console.log(`[EMAIL STUB] ${type} → ${recipientEmail}`, payload)

    return new Response(JSON.stringify({ ok: true, status: 'stubbed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
