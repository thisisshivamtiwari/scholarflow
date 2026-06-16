import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { roleHomePath } from '@/config/roleHome'

export const RoleHomeRedirect = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={roleHomePath(user.role)} replace />
}
