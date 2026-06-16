import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { AuthShell } from '@/components/auth/AuthShell'

export const ForgotPasswordPage = () => {
  const { requestPasswordReset } = useAuth()
  const [schoolId, setSchoolId] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    if (!username.trim()) {
      setError('Enter your username.')
      return
    }
    setSubmitting(true)
    const result = await requestPasswordReset(schoolId, username)
    setSubmitting(false)
    if (result.ok) {
      setInfo('If an account exists, a reset link has been sent to the registered email.')
    } else {
      setError(result.error ?? 'Reset failed')
    }
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle="School users: enter School ID and username. Platform superadmin: leave School ID blank."
    >
      <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
        <div>
          <label htmlFor="schoolId" className="block text-sm font-medium text-foreground">
            School ID <span className="font-normal text-muted-foreground">(optional for superadmin)</span>
          </label>
          <input
            id="schoolId"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        {error ? (
          <p className="text-sm font-medium text-red-600" role="alert">
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
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm disabled:opacity-50"
        >
          {submitting ? 'Sending…' : 'Send reset link'}
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
