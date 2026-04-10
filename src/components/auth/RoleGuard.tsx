import { Navigate, Outlet } from 'react-router-dom'
import type { Role } from '@/types/tms'
import { useAuth } from '@/context/AuthContext'

type RoleGuardProps = {
  roles: Role[]
}

export const RoleGuard = ({ roles }: RoleGuardProps) => {
  const { user } = useAuth()
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/app" replace />
  }
  return <Outlet />
}
