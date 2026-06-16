import { useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'scroll'] as const

export const useSessionTimeout = () => {
  const { isAuthenticated, sessionTimeoutMinutes, logout } = useAuth()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isAuthenticated) return

    const ms = sessionTimeoutMinutes * 60 * 1000

    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        void logout()
        alert('Your session expired due to inactivity. Please sign in again.')
      }, ms)
    }

    reset()
    for (const ev of ACTIVITY_EVENTS) {
      window.addEventListener(ev, reset, { passive: true })
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      for (const ev of ACTIVITY_EVENTS) {
        window.removeEventListener(ev, reset)
      }
    }
  }, [isAuthenticated, sessionTimeoutMinutes, logout])
}
