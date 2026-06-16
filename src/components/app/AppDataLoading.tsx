import type { ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useAppData } from '@/context/AppDataContext'

export const AppDataLoading = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const { isLoading, error, data } = useAppData()

  if (user?.role === 'superadmin') {
    return children
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Loading data…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
        Failed to load data. Check Supabase connection and sign in again.
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-sm text-muted-foreground">
        No data available. Ensure Supabase is running and seeded.
      </div>
    )
  }

  return children
}
