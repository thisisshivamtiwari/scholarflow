import { animated, useSpring } from '@react-spring/web'
import { useReducedMotion } from '@react-spring/core'
import App from './App'

export const Root = () => {
  const reducedMotion = useReducedMotion()
  const instant = reducedMotion === true

  const entry = useSpring({
    from: { opacity: instant ? 1 : 0 },
    to: { opacity: 1 },
    config: { tension: 210, friction: 30 },
    immediate: instant,
  })

  return (
    <animated.div style={entry} className="min-h-dvh w-full max-w-full">
      <App />
    </animated.div>
  )
}
