#!/usr/bin/env node
/**
 * Create platform superadmin auth user + profile on cloud.
 * Usage: SUPABASE_ACCESS_TOKEN=sbp_... node scripts/create-superadmin.mjs
 */
import { createClient } from '@supabase/supabase-js'

const projectRef = 'qeqjxtcvutbpraxdztgu'
const supabaseUrl = `https://${projectRef}.supabase.co`
const apiToken =
  process.env.SUPABASE_ACCESS_TOKEN ?? process.env.SUPABASE_DASHBOARD_TOKEN

if (!apiToken) {
  console.error('Set SUPABASE_ACCESS_TOKEN or SUPABASE_DASHBOARD_TOKEN')
  process.exit(1)
}

const keysRes = await fetch(
  `https://api.supabase.com/v1/projects/${projectRef}/api-keys?reveal=true`,
  { headers: { Authorization: `Bearer ${apiToken}` } },
)
if (!keysRes.ok) {
  console.error('Failed to fetch API keys', await keysRes.text())
  process.exit(1)
}
const keys = await keysRes.json()
const serviceKey = keys.find((k) => k.name === 'service_role')?.api_key
if (!serviceKey) {
  console.error('service_role key not found')
  process.exit(1)
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const SUPERADMIN_ID = 'b0000000-0000-4000-8000-000000000006'
const PLATFORM_SCHOOL_ID = 'a0000000-0000-4000-8000-000000000099'

const { data: existing } = await admin.auth.admin.getUserById(SUPERADMIN_ID)
if (!existing?.user) {
  const { error } = await admin.auth.admin.createUser({
    id: SUPERADMIN_ID,
    email: 'superadmin@scholarflow.app',
    password: 'demo123',
    email_confirm: true,
  })
  if (error) {
    console.error('createUser failed', error.message)
    process.exit(1)
  }
  console.log('Created auth user superadmin@scholarflow.app')
} else {
  console.log('Auth user already exists')
}

const { error: profileErr } = await admin.from('profiles').upsert(
  {
    id: SUPERADMIN_ID,
    school_id: PLATFORM_SCHOOL_ID,
    username: 'superadmin',
    display_name: 'Platform Superadmin',
    email: 'superadmin@scholarflow.app',
    role: 'superadmin',
    class_label: null,
    active: true,
  },
  { onConflict: 'id' },
)
if (profileErr) {
  console.error('profile upsert failed', profileErr.message)
  process.exit(1)
}

console.log('Superadmin ready: username superadmin · password demo123 · no school ID')
