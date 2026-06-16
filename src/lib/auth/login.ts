import { supabase } from '@/lib/supabase'

/** Resolve auth email for school-scoped users (teacher, student, etc.) */
export const resolveSchoolLoginEmail = async (schoolId: string, username: string) => {
  return supabase.rpc('resolve_login_email', {
    p_school_external_id: schoolId,
    p_username: username,
  })
}

/** Resolve auth email for platform superadmin — no school ID */
export const resolvePlatformLoginEmail = async (username: string) => {
  return supabase.rpc('resolve_platform_login_email', { p_username: username })
}

export const resolveLoginEmail = async (schoolId: string, username: string) => {
  if (!schoolId.trim()) {
    return resolvePlatformLoginEmail(username)
  }
  return resolveSchoolLoginEmail(schoolId, username)
}
