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
    if (!authHeader) throw new Error('Unauthorized')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['teacher', 'headmaster', 'admin'].includes(profile.role)) {
      throw new Error('Forbidden')
    }

    const { workspaceId, csvText } = await req.json() as {
      workspaceId: string
      csvText: string
    }

    const lines = csvText.trim().split('\n').slice(1)
    const rows: Array<{
      workspace_id: string
      student_id: string
      category: string
      assessment_name: string
      date: string
      value: string
      remarks: string
    }> = []

    for (const line of lines) {
      const [studentUsername, category, assessmentName, date, value, remarks = ''] =
        line.split(',').map((s) => s.trim())
      if (!studentUsername || !assessmentName) continue

      const { data: student } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', studentUsername)
        .eq('role', 'student')
        .single()

      if (!student) continue

      rows.push({
        workspace_id: workspaceId,
        student_id: student.id,
        category: category || 'test',
        assessment_name: assessmentName,
        date: date || new Date().toISOString().slice(0, 10),
        value,
        remarks,
      })
    }

    if (rows.length === 0) throw new Error('No valid rows found')

    const { error } = await supabase.from('grades').insert(rows)
    if (error) throw error

    return new Response(JSON.stringify({ inserted: rows.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
