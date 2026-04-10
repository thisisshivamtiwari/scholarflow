import { ArrowRight } from 'lucide-react'
import { animated, useSpring } from '@react-spring/web'
import { useReducedMotion } from '@react-spring/core'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'

export const HomeCtaSection = () => {
  const reducedMotion = useReducedMotion()
  const instant = reducedMotion === true
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.18,
    rootMargin: '0px 0px -12% 0px',
  })

  const spring = useSpring({
    opacity: inView || instant ? 1 : 0,
    scale: inView || instant ? 1 : 0.97,
    y: inView || instant ? 0 : 18,
    config: { tension: 240, friction: 32 },
    immediate: instant,
  })

  return (
    <section
      ref={ref}
      className="px-4 pb-16 sm:px-6 sm:pb-20 md:px-8 lg:px-10 lg:pb-24 xl:px-12 2xl:px-16"
      aria-labelledby="home-cta-heading"
    >
      <animated.div
        style={spring}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-primary/20 bg-primary px-6 py-12 text-primary-foreground shadow-lg sm:px-10 sm:py-14 lg:px-14 lg:py-16"
      >
        <div
          className="pointer-events-none absolute -left-24 top-1/2 size-72 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2
              id="home-cta-heading"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              See ScholarFlow on your data in a guided sandbox
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/90 sm:text-base">
              Tell us about your campuses and we’ll provision a private workspace
              with sample and anonymized imports—no engineering tickets required.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/get-started"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary shadow-sm transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Book a live tour
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Compare plans
            </Link>
          </div>
        </div>
      </animated.div>
    </section>
  )
}
