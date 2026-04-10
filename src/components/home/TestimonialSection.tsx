import { Quote } from 'lucide-react'
import { animated, useSpring } from '@react-spring/web'
import { useReducedMotion } from '@react-spring/core'
import { useInView } from 'react-intersection-observer'

export const TestimonialSection = () => {
  const reducedMotion = useReducedMotion()
  const instant = reducedMotion === true
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px',
  })

  const spring = useSpring({
    opacity: inView || instant ? 1 : 0,
    y: inView || instant ? 0 : 20,
    config: { tension: 260, friction: 34 },
    immediate: instant,
  })

  return (
    <section
      ref={ref}
      className="px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-10 lg:py-24 xl:px-12 2xl:px-16"
      aria-label="Customer quote"
    >
      <animated.figure
        style={spring}
        className="mx-auto max-w-4xl rounded-2xl border border-border bg-card px-6 py-10 shadow-sm sm:px-10 sm:py-12"
      >
        <Quote
          className="size-10 text-primary/40"
          aria-hidden
        />
        <blockquote className="mt-4 text-pretty text-lg font-medium leading-relaxed text-foreground sm:text-xl">
          We stopped exporting five different spreadsheets before every leadership
          meeting. ScholarFlow is the first tool our teachers and parents both
          describe as “actually easy.”
        </blockquote>
        <figcaption className="mt-6 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Elena Park</span>
          <span aria-hidden> · </span>
          Chief Academic Officer, Harbor STEM Collective
        </figcaption>
      </animated.figure>
    </section>
  )
}
