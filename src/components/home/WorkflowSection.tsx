import { Plug, Rocket, Workflow } from 'lucide-react'
import { animated, useSpring, useTrail } from '@react-spring/web'
import { useReducedMotion } from '@react-spring/core'
import { useInView } from 'react-intersection-observer'

const steps = [
  {
    title: 'Connect your data',
    body: 'Import rosters, rooms, and subjects—or sync from your SIS with guided recipes our success team tunes with you.',
    icon: Plug,
  },
  {
    title: 'Launch cohorts',
    body: 'Roll out by campus, division, or pilot group. In-app walkthroughs and templates get teachers productive fast.',
    icon: Workflow,
  },
  {
    title: 'Prove impact',
    body: 'Dashboards show adoption, instructional coverage, and family engagement so the board sees ROI without slide decks.',
    icon: Rocket,
  },
]

export const WorkflowSection = () => {
  const reducedMotion = useReducedMotion()
  const instant = reducedMotion === true
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px',
  })

  const titleSpring = useSpring({
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 16,
    config: { tension: 280, friction: 34 },
    immediate: instant,
  })

  const subtitleSpring = useSpring({
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 12,
    config: { tension: 280, friction: 34 },
    delay: instant ? 0 : 60,
    immediate: instant,
  })

  const stepTrail = useTrail(steps.length, {
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 24,
    trail: 95,
    config: { tension: 300, friction: 34 },
    immediate: instant,
  })

  return (
    <section
      ref={ref}
      className="bg-muted/50 px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-10 lg:py-24 xl:px-12 2xl:px-16"
      aria-labelledby="workflow-heading"
    >
      <div className="mx-auto max-w-6xl">
        <animated.h2
          style={titleSpring}
          id="workflow-heading"
          className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          From kickoff to campus-wide momentum in weeks, not semesters
        </animated.h2>
        <animated.p
          style={subtitleSpring}
          className="mx-auto mt-3 max-w-2xl text-center text-base text-muted-foreground"
        >
          ScholarFlow ships with a prescriptive onboarding playbook—your customer
          lead tracks every milestone inside the product.
        </animated.p>
        <ol
          className="mt-12 grid gap-6 md:grid-cols-3"
          role="list"
        >
          {stepTrail.map((style, index) => {
            const step = steps[index]
            if (!step) return null
            const Icon = step.icon
            return (
              <animated.li key={step.title} style={style}>
                <article className="relative h-full rounded-2xl border border-border bg-card p-6 text-center shadow-sm md:text-left">
                  <span
                    className="mb-4 inline-flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <div className="mb-3 flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary mx-auto md:mx-0">
                    <Icon className="size-5 shrink-0" aria-hidden />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </article>
              </animated.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
