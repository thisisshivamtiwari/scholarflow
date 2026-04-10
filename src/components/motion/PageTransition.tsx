import { animated, useTransition } from '@react-spring/web'
import { useReducedMotion } from '@react-spring/core'
import { Outlet, useLocation } from 'react-router-dom'

export const PageTransition = () => {
  const location = useLocation()
  const reducedMotion = useReducedMotion()
  const instant = reducedMotion === true

  const transition = useTransition(location.pathname, {
    from: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -10 },
    exitBeforeEnter: true,
    config: { tension: 320, friction: 36 },
    immediate: instant,
  })

  return transition((style) => (
    <animated.div
      style={style}
      className="flex min-h-0 w-full min-w-0 flex-1 flex-col"
    >
      <Outlet />
    </animated.div>
  ))
}
