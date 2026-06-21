import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { DEMO_SCHOOL_ID } from '@/constants/site'
import { roleHomePath } from '@/config/roleHome'
import { AuthShell } from '@/components/auth/AuthShell'
import { AuthFormSkeleton } from '@/components/ui/LoadingSkeletons'
import { Spinner } from '@/components/ui/Spinner'

export const LoginPage = () => {
  const { isAuthenticated, user, login, isLoading } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string; passwordUpdated?: boolean } | null)?.from
  const passwordUpdated = (location.state as { passwordUpdated?: boolean } | null)?.passwordUpdated
  const redirectTo =
    from && from.startsWith('/app/') && !from.includes('login') ? from : null

  const [schoolId, setSchoolId] = useState(DEMO_SCHOOL_ID)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(
    passwordUpdated ? 'Password updated. Sign in with your new password.' : null,
  )
  const [submitting, setSubmitting] = useState(false)

  if (isLoading) {
    return (
      <AuthShell title="Sign in" subtitle="Checking your session…">
        <AuthFormSkeleton />
      </AuthShell>
    )
  }

  if (isAuthenticated && user) {
    return <Navigate to={redirectTo ?? roleHomePath(user.role)} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)
    const result = await login(schoolId, username, password, remember)
    setSubmitting(false)
    if (!result.ok) setError(result.error ?? 'Login failed')
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="School users need School ID + username. Platform superadmin: leave School ID blank."
    >
      <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
        <div>
          <label htmlFor="schoolId" className="block text-sm font-medium text-foreground">
            School ID{' '}
            <span className="font-normal text-muted-foreground">(optional for superadmin)</span>
          </label>
          <input
            id="schoolId"
            name="schoolId"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            autoComplete="organization"
            placeholder="e.g. DEMO01"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-foreground">
            Username
          </label>
          <input
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="size-4 rounded border-border"
          />
          Remember me
        </label>
        {error ? (
          <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800" role="status">
            {info}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Spinner size="sm" className="border-primary-foreground/30 border-t-primary-foreground" />
              Signing in…
            </>
          ) : (
            'Continue'
          )}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2 text-sm">
        <Link to="/forgot-password" className="font-medium text-primary hover:underline">
          Forgot password?
        </Link>
        <Link to="/get-started" className="text-muted-foreground hover:text-foreground">
          Request a new account
        </Link>
      </div>
    </AuthShell>
  )
}
