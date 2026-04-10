import { Menu, Sparkles, X } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { useReducedMotion } from '@react-spring/core'
import { Link, NavLink } from 'react-router-dom'
import { primaryNav, SITE } from '@/constants/site'
import { AnimatedMount } from '@/components/motion/AnimatedMount'
import { cn } from '@/lib/utils'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    isActive
      ? 'bg-muted text-foreground'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
  )

export const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const reducedMotion = useReducedMotion()
  const instant = reducedMotion === true

  const panelSpring = useSpring({
    maxHeight: mobileOpen ? 400 : 0,
    opacity: mobileOpen ? 1 : 0,
    y: mobileOpen ? 0 : -8,
    config: mobileOpen
      ? { tension: 380, friction: 34 }
      : { tension: 420, friction: 38 },
    immediate: instant,
  })

  const handleToggleMobileNav = () => {
    setMobileOpen((open) => !open)
  }

  const handleMenuButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleToggleMobileNav()
    }
  }

  const handleCloseMobileNav = () => {
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 shadow-sm backdrop-blur supports-backdrop-filter:bg-card/80">
      <AnimatedMount fromY={-10}>
        <div className="mx-auto flex w-full max-w-[100vw] items-center justify-between gap-4 px-4 py-3 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2 sm:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`${SITE.name} home`}
          >
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:size-10"
              aria-hidden
            >
              <Sparkles className="size-5 sm:size-6" strokeWidth={2} />
            </div>
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                {SITE.name}
              </p>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                School operations cloud
              </p>
            </div>
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex lg:gap-2"
            aria-label="Primary"
          >
            {primaryNav.map(({ label, to }) => (
              <NavLink key={to} to={to} className={navLinkClass}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Sign in
            </Link>
            <Link
              to="/get-started"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Get started
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={handleToggleMobileNav}
            onKeyDown={handleMenuButtonKeyDown}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </AnimatedMount>

      <animated.div
        id="mobile-nav"
        style={{
          ...panelSpring,
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
        className="overflow-hidden border-t border-border bg-card md:hidden"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen ? true : undefined}
      >
        <nav
          className="mx-auto flex w-full max-w-[100vw] flex-col gap-1 px-4 py-3 sm:px-6"
          aria-label="Mobile primary"
        >
          {primaryNav.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={navLinkClass}
              onClick={handleCloseMobileNav}
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/login"
            className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={handleCloseMobileNav}
          >
            Sign in
          </Link>
          <Link
            to="/get-started"
            className="mt-1 inline-flex items-center justify-center rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={handleCloseMobileNav}
          >
            Get started
          </Link>
        </nav>
      </animated.div>
    </header>
  )
}
