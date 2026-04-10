import { Sparkles } from 'lucide-react'
import { animated, useTrail } from '@react-spring/web'
import { useReducedMotion } from '@react-spring/core'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { AnimatedInView } from '@/components/motion/AnimatedInView'
import { primaryNav, SITE } from '@/constants/site'

const footerLinkClass =
  'text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm'

export const SiteFooter = () => {
  const reducedMotion = useReducedMotion()
  const instant = reducedMotion === true
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '80px 0px 0px 0px',
  })

  const columnTrail = useTrail(3, {
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 20,
    trail: 85,
    config: { tension: 280, friction: 34 },
    immediate: instant,
  })

  return (
    <footer ref={ref} className="mt-auto w-full border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-[100vw] gap-10 px-4 py-12 sm:px-6 sm:py-14 md:grid-cols-2 md:px-8 lg:grid-cols-4 lg:px-10 lg:py-16 xl:px-12 2xl:px-16">
        <animated.div
          style={columnTrail[0]}
          className="md:col-span-2 lg:col-span-2"
        >
          <div className="flex items-center gap-2">
            <div
              className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              aria-hidden
            >
              <Sparkles className="size-5" strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold text-foreground">{SITE.name}</span>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            {SITE.description}
          </p>
        </animated.div>

        <animated.div style={columnTrail[1]}>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Explore
          </p>
          <ul className="mt-3 space-y-2" role="list">
            {primaryNav.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className={footerLinkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </animated.div>

        <animated.div style={columnTrail[2]}>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Account
          </p>
          <ul className="mt-3 space-y-2" role="list">
            <li>
              <Link to="/login" className={footerLinkClass}>
                Sign in
              </Link>
            </li>
            <li>
              <Link to="/get-started" className={footerLinkClass}>
                Get started
              </Link>
            </li>
          </ul>
        </animated.div>
      </div>

      <AnimatedInView
        className="border-t border-border py-4"
        delay={instant ? 0 : 280}
        threshold={0.05}
        rootMargin="60px 0px 0px 0px"
        innerClassName="contents"
      >
        <div className="mx-auto flex w-full max-w-[100vw] flex-col items-center justify-between gap-2 px-4 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 sm:text-left md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <span>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </span>
          <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-end">
            <span>Status</span>
            <span aria-hidden>·</span>
            <span>Trust center</span>
            <span aria-hidden>·</span>
            <span>Privacy</span>
          </span>
        </div>
      </AnimatedInView>
    </footer>
  )
}
