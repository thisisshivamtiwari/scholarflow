import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { roleHomePath } from '@/config/roleHome'
import { PageLoader } from '@/components/ui/LoadingSkeletons'

export const RoleHomeRedirect = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <PageLoader label="Loading your dashboard…" />
  }

  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={roleHomePath(user.role)} replace />
}
