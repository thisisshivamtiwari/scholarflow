# ScholarFlow — Teaching Management System

Full-stack school TMS built with **React + Vite** (frontend) and **Supabase** (Postgres, Auth, Storage, Edge Functions).

## Features

- Six role-based portals: Teacher, Student, Parent, Headmaster, Admin, Superadmin (platform)
- Curriculum lifecycle with headmaster approval and change requests
- Grades, attendance, timetables, user admin, audit logs
- CSV grade import, PDF/Excel exports, email notification stubs
- Session timeout, forgot password, public account requests

## Prerequisites

- Node.js 20+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for migrations, functions deploy, local stack)
- Docker (required only for **local** Supabase via `supabase start`)

## Quick start (cloud — already configured)

The repo is wired to Supabase project **scholarflow** (`qeqjxtcvutbpraxdztgu`).

```bash
npm install
cp .env.example .env.local   # already populated if you completed setup
npm run dev
```

Open http://localhost:5173/login

### Demo credentials

| School ID | Username   | Password | Role       |
|-----------|------------|----------|------------|
| DEMO01    | teacher    | demo123  | Teacher    |
| DEMO01    | student    | demo123  | Student    |
| DEMO01    | parent     | demo123  | Parent     |
| DEMO01    | headmaster | demo123  | Headmaster |
| DEMO01      | admin      | demo123  | Admin      |
| —           | superadmin | demo123  | Platform superadmin (no school ID) |

Cloud auth is configured for `http://localhost:5173` (site URL + redirect allowlist).  
Add `http://localhost:5173/reset-password` to redirect URLs for password reset.

**Full demo account list and role flows:** [docs/USER_GUIDE.md](docs/USER_GUIDE.md)

## Quick start (local Supabase)

```bash
npm install
npx supabase start
npx supabase db reset
cp .env.example .env.local
# Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from `npx supabase status`
npm run dev
```

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run db:start` | Start Supabase local stack |
| `npm run db:reset` | Reset local DB + migrations/seed |
| `npm run db:types` | Regenerate `src/types/database.ts` (local) |
| `npm run db:cloud-seed` | Re-seed cloud demo data (needs `SUPABASE_ACCESS_TOKEN`) |
| `npm run db:create-superadmin` | Create platform superadmin user on cloud |
| `npm run test:superadmin` | API tests for superadmin (needs `.env.local`) |
| `npm run functions:deploy` | Deploy Edge Functions to cloud (needs `SUPABASE_ACCESS_TOKEN`) |

## Cloud maintenance

Project ref: `qeqjxtcvutbpraxdztgu`  
Dashboard: https://supabase.com/dashboard/project/qeqjxtcvutbpraxdztgu

```bash
# One-time: create a Personal Access Token at supabase.com/dashboard/account/tokens
export SUPABASE_ACCESS_TOKEN=sbp_...

# Link CLI (if not already)
npx supabase link --project-ref qeqjxtcvutbpraxdztgu

# Push new migrations
npx supabase db push

# Deploy Edge Functions
npm run functions:deploy

# Re-seed demo school/users/data
npm run db:cloud-seed
```

Deployed Edge Functions: `admin-users`, `approve-account-request`, `import-grades-csv`, `send-notification`

## Production

**Live app:** https://scholarflow-iota.vercel.app  
**Login:** https://scholarflow-iota.vercel.app/login

Supabase Auth is configured for production + localhost redirect URLs.

## Deploy frontend (Vercel)

Set environment variables:

- `VITE_SUPABASE_URL=https://qeqjxtcvutbpraxdztgu.supabase.co`
- `VITE_SUPABASE_ANON_KEY=<anon key from dashboard>`

Update Supabase Auth **Site URL** and **Redirect URLs** to your production domain.

## Project structure

```
src/           React app (marketing + /app portals)
supabase/
  migrations/  Postgres schema, RLS, audit triggers
  seed.sql     Demo school + users (local); cloud uses scripts/cloud-seed.mjs
  functions/   Edge Functions
scripts/
  cloud-seed.mjs   Cloud demo seed (Auth Admin API + SQL)
prd.txt        Product requirements document
```

## Architecture

- **Auth**: Supabase Auth with `resolve_login_email(school_id, username)` RPC
- **Data**: TanStack Query + `supabase-js`, RLS per role
- **Storage**: `question-papers` bucket for uploaded resources
- **Audit**: Postgres triggers → `audit_logs` table
