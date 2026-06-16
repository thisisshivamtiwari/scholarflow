/* eslint-disable react-refresh/only-export-components -- provider + hook pattern */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AuthUser } from '@/types/tms'
import { resolveLoginEmail } from '@/lib/auth/login'
import { profileToAuthUser } from '@/lib/api/transform'
import { setRememberMe, supabase } from '@/lib/supabase'

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  sessionTimeoutMinutes: number
  login: (
    schoolId: string,
    username: string,
    password: string,
    remember: boolean,
  ) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  requestPasswordReset: (
    schoolId: string,
    username: string,
  ) => Promise<{ ok: boolean; error?: string }>
  updatePassword: (password: string) => Promise<{ ok: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const loadProfile = async (): Promise<{
  user: AuthUser
  sessionTimeoutMinutes: number
} | null> => {
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData.session) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', sessionData.session.user.id)
    .single()

  if (error || !profile) return null

  const { data: school } = await supabase
    .from('schools')
    .select('external_id, session_timeout_minutes')
    .eq('id', profile.school_id)
    .single()

  if (!school) return null

  const user = await profileToAuthUser(profile, school.external_id)
  return { user, sessionTimeoutMinutes: school.session_timeout_minutes }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30)

  useEffect(() => {
    loadProfile()
      .then((result) => {
        if (result) {
          setUser(result.user)
          setSessionTimeoutMinutes(result.sessionTimeoutMinutes)
        }
      })
      .finally(() => setIsLoading(false))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setUser(null)
        return
      }
      const result = await loadProfile()
      if (result) {
        setUser(result.user)
        setSessionTimeoutMinutes(result.sessionTimeoutMinutes)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(
    async (schoolId: string, username: string, password: string, remember: boolean) => {
      setRememberMe(remember)
      const { data: email, error: rpcError } = await resolveLoginEmail(schoolId, username)
      if (rpcError || !email) {
        return {
          ok: false,
          error: schoolId.trim()
            ? 'Invalid school ID, username, or password.'
            : 'Invalid username or password.',
        }
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        return {
          ok: false,
          error: schoolId.trim()
            ? 'Invalid school ID, username, or password.'
            : 'Invalid username or password.',
        }
      }
      const result = await loadProfile()
      if (result) {
        setUser(result.user)
        setSessionTimeoutMinutes(result.sessionTimeoutMinutes)
      }
      return { ok: true }
    },
    [],
  )

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  const requestPasswordReset = useCallback(async (schoolId: string, username: string) => {
    const { data: email, error: rpcError } = await resolveLoginEmail(schoolId, username)
    if (rpcError || !email) {
      return {
        ok: false,
        error: schoolId.trim()
          ? 'Could not find an account with that school ID and username.'
          : 'Could not find a platform account with that username.',
      }
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) return { ok: false, error: error.message }
    await supabase.auth.signOut()
    return { ok: true }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      sessionTimeoutMinutes,
      login,
      logout,
      requestPasswordReset,
      updatePassword,
    }),
    [user, isLoading, sessionTimeoutMinutes, login, logout, requestPasswordReset, updatePassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
