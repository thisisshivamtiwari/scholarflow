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
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Unauthorized')

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    const { data: { user } } = await supabaseUser.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role, school_id')
      .eq('id', user.id)
      .single()

    if (!profile || !['headmaster', 'admin'].includes(profile.role)) {
      throw new Error('Forbidden')
    }

    const body = await req.json()
    const { requestId, action } = body as { requestId: string; action: 'approve' | 'reject' }

    const { data: request } = await supabaseAdmin
      .from('account_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (!request) throw new Error('Request not found')

    if (action === 'reject') {
      await supabaseAdmin
        .from('account_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId)

      await supabaseAdmin.from('notification_log').insert({
        school_id: request.school_id ?? profile.school_id,
        recipient_email: request.email,
        notification_type: 'account_rejected',
        payload: { name: request.name },
        status: 'stubbed',
      })

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const username = request.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
    const authEmail = `${username}@${request.school_external_id.toLowerCase()}.scholarflow.app`

    const { data: authUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: authEmail,
      password: crypto.randomUUID().slice(0, 12),
      email_confirm: true,
    })

    if (createErr) throw createErr

    await supabaseAdmin.from('profiles').insert({
      id: authUser.user.id,
      school_id: request.school_id ?? profile.school_id,
      username,
      display_name: request.name,
      email: authEmail,
      role: request.requested_role,
    })

    await supabaseAdmin
      .from('account_requests')
      .update({ status: 'approved' })
      .eq('id', requestId)

    await supabaseAdmin.from('notification_log').insert({
      school_id: request.school_id ?? profile.school_id,
      recipient_email: request.email,
      notification_type: 'account_approved',
      payload: { name: request.name, loginEmail: authEmail },
      status: 'stubbed',
    })

    return new Response(JSON.stringify({ ok: true, loginEmail: authEmail }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
