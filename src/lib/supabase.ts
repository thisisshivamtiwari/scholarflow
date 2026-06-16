import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. App will not connect to Supabase.',
  )
}

const REMEMBER_KEY = 'tms_remember'

const getStorage = (): Storage => {
  if (typeof window === 'undefined') return localStorage
  return localStorage.getItem(REMEMBER_KEY) === '1' ? localStorage : sessionStorage
}

export const supabase = createClient<Database>(
  supabaseUrl ?? 'http://localhost:54321',
  supabaseAnonKey ?? 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: {
        getItem: (key) => getStorage().getItem(key),
        setItem: (key, value) => getStorage().setItem(key, value),
        removeItem: (key) => getStorage().removeItem(key),
      },
    },
  },
)

export const setRememberMe = (remember: boolean) => {
  if (remember) {
    localStorage.setItem(REMEMBER_KEY, '1')
  } else {
    localStorage.removeItem(REMEMBER_KEY)
  }
}

export const invokeFunction = async <T>(
  name: string,
  body: Record<string, unknown>,
): Promise<T> => {
  const { data, error } = await supabase.functions.invoke(name, { body })
  if (error) throw error
  return data as T
}
