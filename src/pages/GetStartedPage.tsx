import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { SITE } from '@/constants/site'
import { AnimatedMount } from '@/components/motion/AnimatedMount'
import { useAccountRequestSubmit } from '@/hooks/queries/useTmsData'
import { DEMO_SCHOOL_ID } from '@/data/initialAppData'

export const GetStartedPage = () => {
  const submit = useAccountRequestSubmit()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    const firstName = String(fd.get('firstName') ?? '')
    const lastName = String(fd.get('lastName') ?? '')
    const email = String(fd.get('workEmail') ?? '')
    const notes = String(fd.get('notes') ?? '')

    try {
      await submit.mutateAsync({
        schoolExternalId: DEMO_SCHOOL_ID,
        name: `${firstName} ${lastName}`.trim(),
        email,
        requestedRole: 'teacher',
        notes,
      })
      setSubmitted(true)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <AnimatedMount className="flex min-h-0 flex-1 flex-col" fromY={20}>
      <div className="flex flex-1 flex-col justify-center px-4 py-16 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="mx-auto w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-10">
          <h1 className="text-2xl font-semibold text-foreground">
            Request a {SITE.name} account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Submit a request for admin approval (PRD §8.7.2). Demo school ID: {DEMO_SCHOOL_ID}.
          </p>

          {submitted ? (
            <p className="mt-8 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800" role="status">
              Request submitted. A headmaster or admin will review it in Pending tasks.
            </p>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium">First name</label>
                  <input id="firstName" name="firstName" required className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium">Last name</label>
                  <input id="lastName" name="lastName" required className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm" />
                </div>
              </div>
              <div>
                <label htmlFor="workEmail" className="block text-sm font-medium">Work email</label>
                <input id="workEmail" name="workEmail" type="email" required className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm" />
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium">Notes</label>
                <textarea id="notes" name="notes" rows={3} className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm" />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <button type="submit" disabled={submit.isPending} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">
                {submit.isPending ? 'Submitting…' : 'Submit request'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already onboarded?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in to {SITE.name}
            </Link>
          </p>
        </div>
      </div>
    </AnimatedMount>
  )
}
