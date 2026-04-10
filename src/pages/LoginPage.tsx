import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { DUMMY_PASSWORD, dummyUsers } from '@/data/dummyUsers'
import { DEMO_SCHOOL_ID } from '@/data/initialAppData'
import { cn } from '@/lib/utils'

const roleHome = (role: string) => {
  switch (role) {
    case 'teacher':
      return '/app/teacher/dashboard'
    case 'student':
      return '/app/student/subjects'
    case 'parent':
      return '/app/parent/overview'
    case 'headmaster':
      return '/app/headmaster/pending'
    case 'admin':
      return '/app/admin/pending'
    default:
      return '/app'
  }
}

export const LoginPage = () => {
  const { isAuthenticated, user, login } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  const [schoolId, setSchoolId] = useState(DEMO_SCHOOL_ID)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated && user) {
    return <Navigate to={from && from.startsWith('/app') ? from : roleHome(user.role)} replace />
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const result = login(schoolId, username, password, remember)
    if (!result.ok) setError(result.error ?? 'Login failed')
  }

  const handleQuickLogin = (u: string) => {
    setError(null)
    const result = login(DEMO_SCHOOL_ID, u, DUMMY_PASSWORD, remember)
    if (!result.ok) setError(result.error ?? 'Login failed')
  }

  const handleQuickKeyDown = (e: KeyboardEvent, u: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleQuickLogin(u)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-6" aria-hidden />
          </div>
          <span className="text-lg font-semibold">Teaching Management System</span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-center text-xl font-semibold text-foreground">
            Sign in
          </h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            School ID, username, and password (demo: all use{' '}
            <span className="font-mono text-foreground">{DUMMY_PASSWORD}</span>)
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="schoolId" className="block text-sm font-medium text-foreground">
                School ID
              </label>
              <input
                id="schoolId"
                name="schoolId"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                autoComplete="organization"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground">
                Username or email
              </label>
              <input
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                autoComplete="current-password"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              Continue
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-6">
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Quick demo login
            </p>
            <ul className="mt-3 flex flex-wrap justify-center gap-2" role="list">
              {dummyUsers.map((u) => (
                <li key={u.id}>
                  <button
                    type="button"
                    tabIndex={0}
                    onClick={() => handleQuickLogin(u.username)}
                    onKeyDown={(e) => handleQuickKeyDown(e, u.username)}
                    className={cn(
                      'rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-foreground',
                      'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    )}
                  >
                    {u.role}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <span className="text-foreground">Forgot password?</span> Demo only — use{' '}
            <span className="font-mono">{DUMMY_PASSWORD}</span>
          </p>
          <p className="mt-2 text-center text-sm">
            <Link
              to="/get-started"
              className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Request account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
