import { ArrowUpRight } from 'lucide-react'
import { animated, useSpring, useTrail } from '@react-spring/web'
import { useReducedMotion } from '@react-spring/core'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'

type Story = {
  school: string
  region: string
  headline: string
  metric: string
}

const stories: Story[] = [
  {
    school: 'Northbridge Academy',
    region: 'Pacific Northwest · 1,100 students',
    headline: 'Cut leadership reporting time by 63% in a single semester.',
    metric: '63% faster reporting',
  },
  {
    school: 'Lumen International',
    region: 'EU · 4 campuses',
    headline: 'Standardized timetables across countries while honoring local holidays.',
    metric: '4 campuses · 1 playbook',
  },
  {
    school: 'Willow Creek District',
    region: 'US Midwest · 6 schools',
    headline: 'Guardian satisfaction scores jumped after unifying progress visibility.',
    metric: '+28 NPS lift',
  },
]

export const CustomerStoriesSection = () => {
  const reducedMotion = useReducedMotion()
  const instant = reducedMotion === true
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '0px 0px -8% 0px',
  })

  const titleSpring = useSpring({
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 16,
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

  const trail = useTrail(stories.length, {
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 24,
    trail: 88,
    config: { tension: 300, friction: 34 },
    immediate: instant,
  })

  return (
    <section
      ref={ref}
      className="px-4 py-16 sm:px-6 md:px-8 lg:px-10 lg:py-20 xl:px-12 2xl:px-16"
      aria-labelledby="stories-heading"
    >
      <div className="mx-auto max-w-6xl">
        <animated.h2
          style={titleSpring}
          id="stories-heading"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Outcomes our customer team publishes every quarter
        </animated.h2>
        <animated.p
          style={subSpring}
          className="mt-3 max-w-2xl text-base text-muted-foreground"
        >
          Every deployment pairs with measurable goals. Here’s a snapshot of what
          campuses highlight in their public case studies.
        </animated.p>
        <ul className="mt-10 grid gap-6 lg:grid-cols-3" role="list">
          {trail.map((style, index) => {
            const story = stories[index]
            if (!story) return null
            return (
              <animated.li key={story.school} style={style}>
                <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {story.metric}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    {story.headline}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{story.region}</p>
                  <p className="mt-4 text-sm font-medium text-foreground">{story.school}</p>
                  <Link
                    to="/get-started"
                    className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm"
                  >
                    Read the story
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </article>
              </animated.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
