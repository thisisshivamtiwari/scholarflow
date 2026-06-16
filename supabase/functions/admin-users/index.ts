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
    const { action, ...payload } = body as { action: string; [key: string]: unknown }

    switch (action) {
      case 'create': {
        const { username, displayName, email, role, password, classLabel } = payload as {
          username: string
          displayName: string
          email: string
          role: string
          password: string
          classLabel?: string
        }
        const { data: authUser, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        })
        if (error) throw error
        await supabaseAdmin.from('profiles').insert({
          id: authUser.user.id,
          school_id: profile.school_id,
          username,
          display_name: displayName,
          email,
          role,
          class_label: classLabel ?? null,
        })
        return json({ ok: true, userId: authUser.user.id })
      }
      case 'deactivate':
        await supabaseAdmin.from('profiles').update({ active: false }).eq('id', payload.userId)
        return json({ ok: true })
      case 'reactivate':
        await supabaseAdmin.from('profiles').update({ active: true }).eq('id', payload.userId)
        return json({ ok: true })
      case 'resetPassword': {
        const { data: p } = await supabaseAdmin.from('profiles').select('email').eq('id', payload.userId).single()
        if (!p) throw new Error('User not found')
        await supabaseAdmin.auth.resetPasswordForEmail(p.email)
        await supabaseAdmin.from('notification_log').insert({
          school_id: profile.school_id,
          recipient_email: p.email,
          notification_type: 'password_reset',
          payload: {},
          status: 'stubbed',
        })
        return json({ ok: true })
      }
      case 'updateRole':
        await supabaseAdmin.from('profiles').update({ role: payload.role }).eq('id', payload.userId)
        return json({ ok: true })
      case 'importStudents': {
        const csvText = payload.csvText as string
        const lines = csvText.trim().split('\n').slice(1)
        let inserted = 0
        for (const line of lines) {
          const [displayName, username, email, classLabel] = line.split(',').map((s) => s.trim())
          if (!displayName || !username || !email) continue
          const { data: authUser, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: 'ChangeMe123!',
            email_confirm: true,
          })
          if (error) continue
          await supabaseAdmin.from('profiles').insert({
            id: authUser.user.id,
            school_id: profile.school_id,
            username,
            display_name: displayName,
            email,
            role: 'student',
            class_label: classLabel ?? null,
          })
          inserted++
        }
        return json({ ok: true, inserted })
      }
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

const json = (data: unknown) =>
  new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
