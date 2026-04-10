import { animated, useSpring } from '@react-spring/web'
import { useReducedMotion } from '@react-spring/core'
import type { ReactNode } from 'react'

type AnimatedMountProps = {
  children: ReactNode
  className?: string
  delay?: number
  fromY?: number
}

export const AnimatedMount = ({
  children,
  className,
  delay = 0,
  fromY = 18,
}: AnimatedMountProps) => {
  const reducedMotion = useReducedMotion()
  const instant = reducedMotion === true

  const style = useSpring({
    from: {
      opacity: instant ? 1 : 0,
      y: instant ? 0 : fromY,
    },
    to: {
      opacity: 1,
      y: 0,
    },
    delay: instant ? 0 : delay,
    config: { tension: 260, friction: 32 },
  })

  return (
    <animated.div style={style} className={className}>
      {children}
    </animated.div>
  )
}
