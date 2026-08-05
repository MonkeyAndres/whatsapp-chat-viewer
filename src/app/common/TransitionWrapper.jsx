import React from 'react'
import { CSSTransition } from 'react-transition-group'

const prefersReducedMotion = () => (
  typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches
)

const TransitionWrapper = ({ appear, animationType, children }) => {
  if (prefersReducedMotion()) return children

  return (
    <CSSTransition
      appear={appear}
      in={appear}
      timeout={{
        enter: 600,
        exit: 200
      }}
      classNames={animationType}
      mountOnEnter
      unmountOnExit
    >
      {children}
    </CSSTransition>
  )
}

export default TransitionWrapper
