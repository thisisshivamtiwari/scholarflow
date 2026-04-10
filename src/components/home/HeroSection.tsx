import { ArrowRight, LineChart, Shield, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SITE } from '@/constants/site'
import { AnimatedMount } from '@/components/motion/AnimatedMount'

export const HeroSection = () => {
  return (
    <section
      className="relative w-full px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-12 md:px-8 md:pb-20 lg:px-10 lg:pt-16 xl:px-12 2xl:px-16"
      aria-labelledby="hero-title"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-5 py-12 shadow-sm sm:px-8 sm:py-16 md:px-12 md:py-20 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-14">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_-10%,rgba(37,99,235,0.08),transparent)]"
          aria-hidden
        />
        <AnimatedMount fromY={22}>
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/80 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Zap className="size-3.5 text-primary" aria-hidden />
              New · Timetable intelligence beta
            </p>
            <h1
              id="hero-title"
              className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              {SITE.tagline}
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              ScholarFlow replaces the patchwork of files, chats, and single-purpose
              tools with a fast, role-aware workspace—so instruction, operations, and
              families stay aligned without the busywork.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/get-started"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                Start a free trial
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                to="/product"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                See the platform
              </Link>
            </div>
            <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <LineChart className="size-3.5 text-primary" aria-hidden />
                  Adoption
                </dt>
                <dd className="mt-2 text-sm font-semibold text-foreground">
                  Avg. 18-day campus rollout
                </dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Shield className="size-3.5 text-primary" aria-hidden />
                  Security
                </dt>
                <dd className="mt-2 text-sm font-semibold text-foreground">
                  SSO · audit trails · region choice
                </dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Zap className="size-3.5 text-primary" aria-hidden />
                  Speed
                </dt>
                <dd className="mt-2 text-sm font-semibold text-foreground">
                  Sub-second views at scale
                </dd>
              </div>
            </dl>
          </div>
        </AnimatedMount>

        <AnimatedMount delay={110} fromY={26}>
          <div
            className="relative mt-10 rounded-2xl border border-border bg-linear-to-br from-muted/80 to-card p-6 shadow-inner lg:mt-0 lg:p-8"
            aria-label="Product preview"
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <p className="text-sm font-semibold text-foreground">Live campus pulse</p>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                Healthy
              </span>
            </div>
            <ul className="mt-5 space-y-3" role="list">
              <li className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground">
                  Delivery health
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  94% of planned lessons on track this term
                </p>
              </li>
              <li className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground">
                  Family engagement
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  72% weekly active guardian accounts
                </p>
              </li>
              <li className="rounded-xl border border-dashed border-border bg-background/60 p-4">
                <p className="text-sm text-muted-foreground">
                  Executive tiles update as teachers log delivery, attendance
                  syncs, and gradebooks close—no manual deck assembly required.
                </p>
              </li>
            </ul>
          </div>
        </AnimatedMount>
      </div>
    </section>
  )
}
