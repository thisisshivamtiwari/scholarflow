import { Check } from 'lucide-react'
import { animated, useSpring, useTrail } from '@react-spring/web'
import { useReducedMotion } from '@react-spring/core'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'

type Tier = {
  name: string
  price: string
  cadence: string
  blurb: string
  highlights: string[]
  cta: string
  href: string
  emphasized?: boolean
}

const tiers: Tier[] = [
  {
    name: 'Starter',
    price: '$4.2k',
    cadence: '/ year · up to 400 seats',
    blurb: 'Perfect for single-campus pilots that need the full platform without enterprise add-ons.',
    highlights: [
      'Core curriculum & resource hub',
      'Attendance + guardian portal',
      'Standard success onboarding',
    ],
    cta: 'Talk to sales',
    href: '/get-started',
  },
  {
    name: 'Campus',
    price: '$9.8k',
    cadence: '/ year · up to 1.5k seats',
    blurb: 'The bundle multi-site independents choose when leadership wants predictive insight.',
    highlights: [
      'Advanced analytics & benchmarks',
      'Timetable intelligence beta',
      'Dedicated customer lead',
      'SIS sync recipes (top vendors)',
    ],
    cta: 'Start procurement',
    href: '/get-started',
    emphasized: true,
  },
  {
    name: 'System',
    price: 'Let’s scope',
    cadence: 'districts & networks',
    blurb: 'Custom SLAs, premium support channels, and solution architects embedded quarterly.',
    highlights: [
      'Multi-tenant governance',
      'Private connectivity options',
      'Custom data residency reviews',
      'Executive business reviews',
    ],
    cta: 'Book an architecture session',
    href: '/get-started',
  },
]

export const PricingTiers = () => {
  const reducedMotion = useReducedMotion()
  const instant = reducedMotion === true
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.08,
    rootMargin: '0px 0px -6% 0px',
  })

  const trail = useTrail(tiers.length, {
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 28,
    trail: 100,
    config: { tension: 290, friction: 34 },
    immediate: instant,
  })

  const footSpring = useSpring({
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 10,
    config: { tension: 260, friction: 34 },
    delay: instant ? 0 : inView ? 400 : 0,
    immediate: instant,
  })

  return (
    <section
      ref={ref}
      className="px-4 py-16 sm:px-6 md:px-8 lg:px-10 lg:py-20 xl:px-12 2xl:px-16"
      aria-labelledby="pricing-tiers-heading"
    >
      <h2 id="pricing-tiers-heading" className="sr-only">
        Pricing tiers
      </h2>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
        {trail.map((style, index) => {
          const tier = tiers[index]
          if (!tier) return null
          return (
            <animated.article
              key={tier.name}
              style={style}
              className={
                tier.emphasized
                  ? 'flex flex-col rounded-2xl border-2 border-primary bg-card p-8 shadow-lg'
                  : 'flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm'
              }
            >
              <p className="text-sm font-semibold text-primary">{tier.name}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                {tier.price}
              </p>
              <p className="text-sm text-muted-foreground">{tier.cadence}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {tier.blurb}
              </p>
              <ul className="mt-6 flex-1 space-y-3" role="list">
                {tier.highlights.map((line) => (
                  <li key={line} className="flex gap-2 text-sm text-foreground">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={tier.href}
                className={
                  tier.emphasized
                    ? 'mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card'
                    : 'mt-8 inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card'
                }
              >
                {tier.cta}
              </Link>
            </animated.article>
          )
        })}
      </div>
      <animated.p
        style={footSpring}
        className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground"
      >
        Volume discounts apply for state-wide agreements. Nonprofits and emerging
        markets programs may qualify for impact pricing—ask during your intro
        call.
      </animated.p>
    </section>
  )
}
