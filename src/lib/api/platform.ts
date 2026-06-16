import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

export type SchoolRow = Database['public']['Tables']['schools']['Row']

export const PLATFORM_SCHOOL_EXTERNAL_ID = 'SCHOLARFLOW'

export const fetchAllSchools = async (): Promise<SchoolRow[]> => {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .neq('external_id', PLATFORM_SCHOOL_EXTERNAL_ID)
    .order('name')
  if (error) throw error
  return data ?? []
}

export const fetchPlatformStats = async () => {
  const [schoolsRes, profilesRes, pendingRes] = await Promise.all([
    supabase.from('schools').select('id', { count: 'exact', head: true }).neq('external_id', PLATFORM_SCHOOL_EXTERNAL_ID),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).neq('role', 'superadmin'),
    supabase.from('account_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ])
  if (schoolsRes.error) throw schoolsRes.error
  if (profilesRes.error) throw profilesRes.error
  if (pendingRes.error) throw pendingRes.error
  return {
    schoolCount: schoolsRes.count ?? 0,
    userCount: profilesRes.count ?? 0,
    pendingAccountRequests: pendingRes.count ?? 0,
  }
}

export const createSchool = async (input: {
  externalId: string
  name: string
  academicYear?: string
}) => {
  const { data, error } = await supabase
    .from('schools')
    .insert({
      external_id: input.externalId.trim().toUpperCase(),
      name: input.name.trim(),
      academic_year: input.academicYear ?? '2025–2026',
    })
    .select('*')
    .single()
  if (error) throw error
  return data
}

export const fetchAllAccountRequests = async () => {
  const { data, error } = await supabase
    .from('account_requests')
    .select('*')
    .order('requested_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
