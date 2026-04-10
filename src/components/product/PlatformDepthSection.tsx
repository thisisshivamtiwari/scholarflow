import { Cpu, Globe2, Lock, SlidersHorizontal } from 'lucide-react'
import { animated, useSpring, useTrail } from '@react-spring/web'
import { useReducedMotion } from '@react-spring/core'
import { useInView } from 'react-intersection-observer'

const pillars = [
  {
    title: 'Enterprise controls',
    body: 'Granular roles, break-glass access, and export policies that satisfy district IT and independent auditors alike.',
    icon: Lock,
  },
  {
    title: 'Global-ready',
    body: 'Multi-campus hierarchies, locale-aware formats, and deployment options in the region your policies require.',
    icon: Globe2,
  },
  {
    title: 'Automation layer',
    body: 'Webhook and API surfaces to orchestrate roster updates, billing systems, and bespoke analytics warehouses.',
    icon: Cpu,
  },
  {
    title: 'Tailored grading',
    body: 'Model any rubric stack—from standards-based to IB—and let teachers work inside a single, consistent UI.',
    icon: SlidersHorizontal,
  },
]

export const PlatformDepthSection = () => {
  const reducedMotion = useReducedMotion()
  const instant = reducedMotion === true
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '0px 0px -8% 0px',
  })

  const headingSpring = useSpring({
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 14,
    config: { tension: 280, friction: 34 },
    immediate: instant,
  })

  const subSpring = useSpring({
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 12,
    config: { tension: 280, friction: 34 },
    delay: instant ? 0 : 70,
    immediate: instant,
  })

  const trail = useTrail(pillars.length, {
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 22,
    trail: 80,
    config: { tension: 300, friction: 34 },
    immediate: instant,
  })

  return (
    <section
      ref={ref}
      className="border-t border-border px-4 py-16 sm:px-6 md:px-8 lg:px-10 lg:py-20 xl:px-12 2xl:px-16"
      aria-labelledby="depth-heading"
    >
      <div className="mx-auto max-w-6xl">
        <animated.h2
          style={headingSpring}
          id="depth-heading"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Built for complex organizations, not single-class experiments
        </animated.h2>
        <animated.p
          style={subSpring}
          className="mt-3 max-w-2xl text-base text-muted-foreground"
        >
          ScholarFlow inherits patterns from vertical SaaS leaders: opinionated
          defaults, escape hatches for power users, and a roadmap shaped with
          superintendents—not focus groups.
        </animated.p>
        <ul
          className="mt-12 grid gap-6 sm:grid-cols-2"
          role="list"
        >
          {trail.map((style, index) => {
            const pillar = pillars[index]
            if (!pillar) return null
            const Icon = pillar.icon
            return (
              <animated.li key={pillar.title} style={style}>
                <article className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {pillar.body}
                    </p>
                  </div>
                </article>
              </animated.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
