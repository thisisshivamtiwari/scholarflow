#!/usr/bin/env node
/**
 * Superadmin platform E2E — cloud API + optional UI route list for manual/Playwright use.
 * Usage: node scripts/test-superadmin.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dir, '..')

function loadEnv() {
  try {
    const raw = readFileSync(resolve(root, '.env.local'), 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/)
      if (m) process.env[m[1].trim()] = m[2].trim()
    }
  } catch {
    /* ignore */
  }
}
loadEnv()

const URL = process.env.VITE_SUPABASE_URL
const ANON = process.env.VITE_SUPABASE_ANON_KEY
if (!URL || !ANON) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const PLATFORM_SCHOOL = 'a0000000-0000-4000-8000-000000000099'
const DEMO_SCHOOL = 'a0000000-0000-4000-8000-000000000001'

const results = []
const pass = (name, detail = '') => results.push({ name, ok: true, detail })
const fail = (name, detail = '') => results.push({ name, ok: false, detail })

const anon = createClient(URL, ANON, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function loginSuperadmin(usePlatformRpc = true) {
  let email
  if (usePlatformRpc) {
    const { data, error: rpcErr } = await anon.rpc('resolve_platform_login_email', {
      p_username: 'superadmin',
    })
    if (rpcErr || !data) throw new Error(`resolve_platform_login_email: ${rpcErr?.message ?? 'no email'}`)
    email = data
  } else {
    const { data, error: rpcErr } = await anon.rpc('resolve_login_email', {
      p_school_external_id: 'SCHOLARFLOW',
      p_username: 'superadmin',
    })
    if (rpcErr || !data) throw new Error(`resolve_login_email: ${rpcErr?.message ?? 'no email'}`)
    email = data
  }
  const { data, error } = await anon.auth.signInWithPassword({ email, password: 'demo123' })
  if (error) throw new Error(`signIn: ${error.message}`)
  return createClient(URL, ANON, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${data.session.access_token}` } },
  })
}

async function expectOk(name, fn) {
  try {
    const detail = await fn()
    pass(name, typeof detail === 'string' ? detail : '')
  } catch (e) {
    fail(name, e.message)
  }
}

async function expectFail(name, fn) {
  try {
    await fn()
    fail(name, 'expected failure but succeeded')
  } catch {
    pass(name, 'correctly denied')
  }
}

console.log('ScholarFlow — superadmin platform tests\n')

let sa
try {
  sa = await loginSuperadmin()
  pass('login superadmin (no school ID)', 'session ok')
} catch (e) {
  fail('login superadmin (no school ID)', e.message)
  console.log('\nCannot continue without login.\n')
  process.exit(1)
}

await expectOk('platform login RPC resolves email', async () => {
  const { data, error } = await anon.rpc('resolve_platform_login_email', { p_username: 'superadmin' })
  if (error) throw error
  if (data !== 'superadmin@scholarflow.app') throw new Error(String(data))
  return data
})

await expectOk('profile role is superadmin', async () => {
  const { data, error } = await sa.from('profiles').select('role,username').eq('id', (await sa.auth.getUser()).data.user.id).single()
  if (error) throw error
  if (data.role !== 'superadmin') throw new Error(JSON.stringify(data))
  return data.username
})

await expectOk('read platform school profile', async () => {
  const { data, error } = await sa.from('schools').select('external_id,name').eq('id', PLATFORM_SCHOOL).single()
  if (error) throw error
  if (data.external_id !== 'SCHOLARFLOW') throw new Error(data.external_id)
  return data.name
})

await expectOk('list customer schools (excl platform)', async () => {
  const { data, error } = await sa.from('schools').select('external_id').neq('external_id', 'SCHOLARFLOW')
  if (error) throw error
  if (!data?.some((s) => s.external_id === 'DEMO01')) throw new Error('DEMO01 missing')
  return `${data.length} schools`
})

await expectOk('cross-tenant read DEMO01 profiles', async () => {
  const { data, error } = await sa.from('profiles').select('id').eq('school_id', DEMO_SCHOOL)
  if (error) throw error
  if ((data?.length ?? 0) < 5) throw new Error(`expected >=5, got ${data?.length}`)
  return `${data?.length} profiles in DEMO01`
})

await expectOk('cross-tenant read workspaces', async () => {
  const { data, error } = await sa.from('workspaces').select('id').eq('school_id', DEMO_SCHOOL)
  if (error) throw error
  return `${data?.length ?? 0} workspaces`
})

await expectOk('read all account requests', async () => {
  const { data, error } = await sa.from('account_requests').select('id,status')
  if (error) throw error
  return `${data?.length ?? 0} requests`
})

await expectOk('read platform audit logs', async () => {
  const { data, error } = await sa.from('audit_logs').select('id').limit(10)
  if (error) throw error
  return `${data?.length ?? 0} entries`
})

await expectOk('read notification log', async () => {
  const { data, error } = await sa.from('notification_log').select('id').limit(5)
  if (error) throw error
  return `${data?.length ?? 0} notifications`
})

const testSchoolId = `E2E${Date.now().toString(36).slice(-4).toUpperCase()}`
let createdSchoolUuid = null

await expectOk('create customer school', async () => {
  const { data, error } = await sa
    .from('schools')
    .insert({
      external_id: testSchoolId,
      name: 'E2E Test Academy',
      academic_year: '2025–2026',
    })
    .select('id,external_id')
    .single()
  if (error) throw error
  createdSchoolUuid = data.id
  return data.external_id
})

await expectOk('delete test school (cleanup)', async () => {
  if (!createdSchoolUuid) throw new Error('no school to delete')
  const { error } = await sa.from('schools').delete().eq('id', createdSchoolUuid)
  if (error) throw error
  return 'deleted'
})

await expectFail('cannot approve syllabus (headmaster only)', async () => {
  const { data: ws } = await sa.from('workspaces').select('id').eq('school_id', DEMO_SCHOOL).limit(1).single()
  const { error } = await sa.rpc('approve_syllabus', { p_workspace_id: ws.id })
  if (error) throw error
})

await anon.auth.signOut()

await expectOk('teacher cannot list all schools', async () => {
  const { data: email } = await anon.rpc('resolve_login_email', {
    p_school_external_id: 'DEMO01',
    p_username: 'teacher',
  })
  const { data: auth } = await anon.auth.signInWithPassword({ email, password: 'demo123' })
  const t = createClient(URL, ANON, {
    global: { headers: { Authorization: `Bearer ${auth.session.access_token}` } },
  })
  const { data, error } = await t.from('schools').select('id')
  await anon.auth.signOut()
  if (error) throw error
  if ((data?.length ?? 0) !== 1) throw new Error(`teacher saw ${data?.length} schools`)
  return 'single school only'
})

export const SUPERADMIN_UI_ROUTES = [
  '/app/superadmin/dashboard',
  '/app/superadmin/schools',
  '/app/superadmin/account-requests',
  '/app/superadmin/audit-log',
]

const passed = results.filter((r) => r.ok).length
const failed = results.filter((r) => !r.ok)

console.log('── API Results ──\n')
for (const r of results) {
  console.log(`${r.ok ? '✓' : '✗'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`)
}
console.log(`\n${passed}/${results.length} passed`)

if (failed.length) {
  console.log('\nFailed:')
  for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`)
  process.exit(1)
}

console.log('\nUI routes to verify:', SUPERADMIN_UI_ROUTES.join(', '))
