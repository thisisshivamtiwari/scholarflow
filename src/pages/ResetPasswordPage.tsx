import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { AuthShell } from '@/components/auth/AuthShell'
import { supabase } from '@/lib/supabase'

export const ResetPasswordPage = () => {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const { data } = await supabase.auth.getSession()
      if (cancelled) return
      if (data.session) {
        setHasSession(true)
        setReady(true)
        return
      }
      const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY' && session) {
          setHasSession(true)
          setReady(true)
        }
      })
      window.setTimeout(() => {
        if (!cancelled) setReady(true)
      }, 1200)
      return () => sub.subscription.unsubscribe()
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [])

  if (ready && !hasSession) {
    return <Navigate to="/forgot-password" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    const result = await updatePassword(password)
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error ?? 'Could not update password')
      return
    }
    navigate('/login', { replace: true, state: { passwordUpdated: true } })
  }

  if (!ready) {
    return (
      <AuthShell title="Reset password" subtitle="Verifying your reset link…">
        <p className="text-center text-sm text-muted-foreground">Please wait.</p>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Choose a new password" subtitle="Enter a new password for your account.">
      <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            New password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        {error ? (
          <p className="text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Update password'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  )
}
