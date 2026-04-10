import { Link } from 'react-router-dom'
import { SITE } from '@/constants/site'
import { AnimatedMount } from '@/components/motion/AnimatedMount'

export const GetStartedPage = () => {
  return (
    <AnimatedMount className="flex min-h-0 flex-1 flex-col" fromY={20}>
      <div className="flex flex-1 flex-col justify-center px-4 py-16 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="mx-auto w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-10">
        <h1 className="text-2xl font-semibold text-foreground">
          Let’s design your ScholarFlow rollout
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Share a few details—our team responds within one business day with a
          tailored sandbox and recommended tier.
        </p>
        <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-foreground"
              >
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="sm:col-span-1">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-foreground"
              >
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="workEmail"
              className="block text-sm font-medium text-foreground"
            >
              Work email
            </label>
            <input
              id="workEmail"
              name="workEmail"
              type="email"
              autoComplete="email"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label
              htmlFor="organization"
              className="block text-sm font-medium text-foreground"
            >
              School or network name
            </label>
            <input
              id="organization"
              name="organization"
              type="text"
              autoComplete="organization"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-foreground"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              defaultValue=""
            >
              <option value="" disabled>
                Select one
              </option>
              <option value="instructional">Instructional leader</option>
              <option value="operations">Operations / registrar</option>
              <option value="technology">Technology director</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-foreground"
            >
              What should we know?
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Campus count, current tools, timeline..."
              className="mt-1.5 w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            Request a walkthrough
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already onboarded?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm"
          >
            Sign in to {SITE.name}
          </Link>
        </p>
        </div>
      </div>
    </AnimatedMount>
  )
}
