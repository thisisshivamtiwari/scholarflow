import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useAppData } from '@/context/AppDataContext'
import { PageLoader, PageSkeleton } from '@/components/ui/LoadingSkeletons'
import { pageSkeletonTableColumns, pageSkeletonVariant } from '@/lib/page-skeleton-variant'

export const AppDataLoading = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const { isLoading, isFetching, error, data } = useAppData()
  const variant = pageSkeletonVariant(pathname)
  const tableColumns = pageSkeletonTableColumns(pathname)

  if (user?.role === 'superadmin') {
    return children
  }

  if (isLoading) {
    return <PageSkeleton variant={variant} tableColumns={tableColumns} />
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
        Failed to load data. Check Supabase connection and sign in again.
      </div>
    )
  }

  if (!data) {
    return <PageLoader label="Preparing your workspace…" />
  }

  return (
    <>
      {isFetching ? (
        <p className="sr-only" role="status" aria-live="polite">
          Refreshing data…
        </p>
      ) : null}
      {children}
    </>
  )
}
