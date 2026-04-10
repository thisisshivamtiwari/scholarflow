import { animated, useSpring } from '@react-spring/web'
import { useReducedMotion } from '@react-spring/core'
import { useInView } from 'react-intersection-observer'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type AnimatedInViewProps = {
  children: ReactNode
  className?: string
  /** Extra class on the animated inner wrapper */
  innerClassName?: string
  delay?: number
  threshold?: number
  rootMargin?: string
  y?: number
}

export const AnimatedInView = ({
  children,
  className,
  innerClassName,
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -8% 0px',
  y = 20,
}: AnimatedInViewProps) => {
  const reducedMotion = useReducedMotion()
  const instant = reducedMotion === true
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold,
    rootMargin,
  })

  const style = useSpring({
    opacity: instant ? 1 : inView ? 1 : 0,
    y: instant ? 0 : inView ? 0 : y,
    config: { tension: 280, friction: 34 },
    delay: instant ? 0 : inView ? delay : 0,
  })

  return (
    <div ref={ref} className={cn(className)}>
      <animated.div style={style} className={cn('h-full w-full', innerClassName)}>
        {children}
      </animated.div>
    </div>
  )
}
