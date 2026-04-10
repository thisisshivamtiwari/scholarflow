import {
  BarChart3,
  BellRing,
  BookMarked,
  CalendarRange,
  Layers3,
  UsersRound,
} from 'lucide-react'
import { animated, useSpring, useTrail } from '@react-spring/web'
import { useReducedMotion } from '@react-spring/core'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type FeatureItem = {
  title: string
  body: string
  icon: typeof BookMarked
}

const items: FeatureItem[] = [
  {
    title: 'Curriculum OS',
    body: 'Author, version, and publish instructional plans with guardrails that match how your leadership actually approves change.',
    icon: BookMarked,
  },
  {
    title: 'Unified timetables',
    body: 'Drag, detect conflicts, and publish schedules that stay accurate for staff, students, and rooms—without a maze of PDFs.',
    icon: CalendarRange,
  },
  {
    title: 'Attendance that sticks',
    body: 'Capture lesson and day-level presence with reason codes your registrar expects, then pipe summaries anywhere stakeholders look.',
    icon: UsersRound,
  },
  {
    title: 'Grade intelligence',
    body: 'Flexible schemes, bulk ingest, and at-a-glance risk signals so interventions happen while the term is still in motion.',
    icon: BarChart3,
  },
  {
    title: 'Family experience',
    body: 'Give guardians a calm, modern portal—progress, context, and optional resource sharing on your terms.',
    icon: BellRing,
  },
  {
    title: 'Composable workspaces',
    body: 'Spin up role-aware hubs for teachers, leaders, and ops so everyone lands on work, not configuration.',
    icon: Layers3,
  },
]

type FeaturesGridSectionProps = {
  eyebrow?: string
  title?: string
  subtitle?: string
  className?: string
  headingId?: string
}

export const FeaturesGridSection = ({
  eyebrow = 'Platform',
  title = 'Everything operations teams promised—finally in one subscription',
  subtitle = 'ScholarFlow is modular where it matters: adopt the pillars you need now, switch on advanced analytics when leadership is ready.',
  className,
  headingId = 'features-heading',
}: FeaturesGridSectionProps) => {
  const reducedMotion = useReducedMotion()
  const instant = reducedMotion === true
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.08,
    rootMargin: '0px 0px -6% 0px',
  })

  const headerSpring = useSpring({
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 14,
    config: { tension: 280, friction: 34 },
    immediate: instant,
  })

  const trail = useTrail(items.length, {
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 22,
    trail: 68,
    config: { tension: 300, friction: 34 },
    immediate: instant,
  })

  const linkSpring = useSpring({
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 12,
    config: { tension: 280, friction: 34 },
    delay: instant ? 0 : inView ? 340 : 0,
    immediate: instant,
  })

  return (
    <section
      ref={ref}
      className={cn(
        'px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-10 lg:py-24 xl:px-12 2xl:px-16',
        className,
      )}
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-6xl">
        <animated.div style={headerSpring} className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">{eyebrow}</p>
          <h2
            id={headingId}
            className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            {subtitle}
          </p>
        </animated.div>

        <ul
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {trail.map((style, index) => {
            const item = items[index]
            if (!item) return null
            const Icon = item.icon
            return (
              <animated.li key={item.title} style={style}>
                <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" strokeWidth={2} aria-hidden />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </article>
              </animated.li>
            )
          })}
        </ul>

        <animated.div style={linkSpring} className="mt-10 text-center">
          <Link
            to="/product"
            className="inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
          >
            Explore the full capability map
          </Link>
        </animated.div>
      </div>
    </section>
  )
}
