#!/usr/bin/env node
/**
 * Cloud seed for ScholarFlow — creates auth users via Admin API, then loads demo data.
 * Usage: SUPABASE_DASHBOARD_TOKEN=<jwt from logged-in dashboard> node scripts/cloud-seed.mjs
 */
import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const projectRef = 'qeqjxtcvutbpraxdztgu'
const supabaseUrl = `https://${projectRef}.supabase.co`
const apiToken =
  process.env.SUPABASE_ACCESS_TOKEN ?? process.env.SUPABASE_DASHBOARD_TOKEN

if (!apiToken) {
  console.error('Set SUPABASE_ACCESS_TOKEN (sbp_...) or SUPABASE_DASHBOARD_TOKEN')
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

const demoUsers = [
  {
    id: 'b0000000-0000-4000-8000-000000000001',
    email: 'teacher@demo01.scholarflow.app',
  },
  {
    id: 'b0000000-0000-4000-8000-000000000002',
    email: 'student@demo01.scholarflow.app',
  },
  {
    id: 'b0000000-0000-4000-8000-000000000003',
    email: 'parent@demo01.scholarflow.app',
  },
  {
    id: 'b0000000-0000-4000-8000-000000000004',
    email: 'headmaster@demo01.scholarflow.app',
  },
  {
    id: 'b0000000-0000-4000-8000-000000000005',
    email: 'admin@demo01.scholarflow.app',
  },
  {
    id: 'b0000000-0000-4000-8000-000000000006',
    email: 'superadmin@scholarflow.app',
  },
  {
    id: 'b0000000-0000-4000-8000-000000000010',
    email: 'jordan@demo01.scholarflow.app',
  },
  {
    id: 'b0000000-0000-4000-8000-000000000011',
    email: 'sam@demo01.scholarflow.app',
  },
]

for (const user of demoUsers) {
  const { data: existing } = await admin.auth.admin.getUserById(user.id)
  if (existing?.user) {
    console.log('exists', user.email)
    continue
  }
  const { error } = await admin.auth.admin.createUser({
    id: user.id,
    email: user.email,
    password: 'demo123',
    email_confirm: true,
  })
  if (error) {
    console.error('createUser failed', user.email, error.message)
    process.exit(1)
  }
  console.log('created', user.email)
}

const seedSql = fs.readFileSync('supabase/seed.sql', 'utf8')
const dataSql = seedSql.replace(
  /-- Auth users[\s\S]*?END \$\$;\n\n/,
  '-- Auth users created via Admin API\n\n',
)

const queryRes = await fetch(
  `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: dataSql }),
  },
)
const body = await queryRes.text()
console.log('seed SQL status', queryRes.status)
if (!queryRes.ok) {
  console.error(body)
  process.exit(1)
}
console.log('Cloud seed complete.')
