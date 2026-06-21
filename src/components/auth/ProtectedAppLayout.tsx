import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { AppLayout } from '@/layouts/AppLayout'
import { PageLoader } from '@/components/ui/LoadingSkeletons'

export const ProtectedAppLayout = () => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <PageLoader label="Loading session…" fullScreen />
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <AppLayout />
}
