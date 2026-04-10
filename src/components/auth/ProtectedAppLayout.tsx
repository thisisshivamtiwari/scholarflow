import { Navigate, useLocation } from 'react-router-dom'
import { AppDataProvider } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { AppLayout } from '@/layouts/AppLayout'

export const ProtectedAppLayout = () => {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <AppDataProvider key={user.id}>
      <AppLayout />
    </AppDataProvider>
  )
}
