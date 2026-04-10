import { animated, useSpring, useTrail } from '@react-spring/web'
import { useReducedMotion } from '@react-spring/core'
import { useInView } from 'react-intersection-observer'

const logos = [
  'Northbridge Academy',
  'Harbor STEM',
  'Willow Creek District',
  'Lumen International',
  'Ridgeline Prep',
]

export const LogoCloudSection = () => {
  const reducedMotion = useReducedMotion()
  const instant = reducedMotion === true
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: '0px 0px -5% 0px',
  })

  const labelSpring = useSpring({
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 10,
    config: { tension: 280, friction: 34 },
    immediate: instant,
  })

  const logoTrail = useTrail(logos.length, {
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 14,
    trail: 55,
    config: { tension: 320, friction: 34 },
    immediate: instant,
  })

  return (
    <section
      ref={ref}
      className="border-y border-border bg-muted/40 px-4 py-10 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16"
      aria-label="Organizations that use ScholarFlow"
    >
      <animated.p
        style={labelSpring}
        className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        Trusted by forward-looking schools and groups
      </animated.p>
      <ul
        className="mx-auto mt-6 flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4"
        role="list"
      >
        {logoTrail.map((style, index) => {
          const name = logos[index]
          if (!name) return null
          return (
            <animated.li
              key={name}
              style={style}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {name}
            </animated.li>
          )
        })}
      </ul>
    </section>
  )
}
