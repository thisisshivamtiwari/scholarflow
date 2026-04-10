import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export const RoleHomeRedirect = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  switch (user.role) {
    case 'teacher':
      return <Navigate to="/app/teacher/dashboard" replace />
    case 'student':
      return <Navigate to="/app/student/subjects" replace />
    case 'parent':
      return <Navigate to="/app/parent/overview" replace />
    case 'headmaster':
      return <Navigate to="/app/headmaster/pending" replace />
    case 'admin':
      return <Navigate to="/app/admin/pending" replace />
    default:
      return <Navigate to="/login" replace />
  }
}
