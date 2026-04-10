import { animated, useSpring } from '@react-spring/web'
import { useReducedMotion } from '@react-spring/core'
import { useInView } from 'react-intersection-observer'

type PageHeroProps = {
  eyebrow?: string
  title: string
  subtitle: string
}

export const PageHero = ({ eyebrow, title, subtitle }: PageHeroProps) => {
  const reducedMotion = useReducedMotion()
  const instant = reducedMotion === true
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.35,
    rootMargin: '40px 0px 0px 0px',
  })

  const eyebrowSpring = useSpring({
    opacity: inView || instant ? 1 : 0,
    x: inView || instant ? 0 : -12,
    config: { tension: 300, friction: 34 },
    immediate: instant,
  })

  const titleSpring = useSpring({
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 18,
    config: { tension: 280, friction: 34 },
    delay: instant ? 0 : 50,
    immediate: instant,
  })

  const subtitleSpring = useSpring({
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 14,
    config: { tension: 280, friction: 34 },
    delay: instant ? 0 : 110,
    immediate: instant,
  })

  return (
    <section
      ref={ref}
      className="border-b border-border bg-linear-to-b from-muted/60 to-background px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10 xl:px-12 2xl:px-16"
      aria-labelledby="page-hero-title"
    >
      <div className="mx-auto max-w-3xl">
        {eyebrow ? (
          <animated.p
            style={eyebrowSpring}
            className="text-sm font-semibold text-primary"
          >
            {eyebrow}
          </animated.p>
        ) : null}
        <animated.h1
          style={titleSpring}
          id="page-hero-title"
          className="mt-2 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          {title}
        </animated.h1>
        <animated.p
          style={subtitleSpring}
          className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {subtitle}
        </animated.p>
      </div>
    </section>
  )
}
