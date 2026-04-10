/* eslint-disable react-refresh/only-export-components -- provider + hook pattern */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AuthUser } from '@/types/tms'
import { findDummyUser } from '@/data/dummyUsers'

const STORAGE_KEY = 'tms_session'
const REMEMBER_KEY = 'tms_remember'

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (
    schoolId: string,
    username: string,
    password: string,
    remember: boolean,
  ) => { ok: boolean; error?: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const loadStoredUser = (): AuthUser | null => {
  try {
    const useLocal = localStorage.getItem(REMEMBER_KEY) === '1'
    const raw = useLocal
      ? localStorage.getItem(STORAGE_KEY)
      : sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => loadStoredUser())

  const login = useCallback(
    (
      schoolId: string,
      username: string,
      password: string,
      remember: boolean,
    ) => {
      const found = findDummyUser(schoolId, username, password)
      if (!found) {
        return {
          ok: false,
          error: 'Invalid school ID, username, or password.',
        }
      }
      setUser(found)
      const payload = JSON.stringify(found)
      sessionStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STORAGE_KEY)
      if (remember) {
        localStorage.setItem(REMEMBER_KEY, '1')
        localStorage.setItem(STORAGE_KEY, payload)
      } else {
        localStorage.removeItem(REMEMBER_KEY)
        sessionStorage.setItem(STORAGE_KEY, payload)
      }
      return { ok: true }
    },
    [],
  )

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(REMEMBER_KEY)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      logout,
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
