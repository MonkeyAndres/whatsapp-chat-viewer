import React from 'react'
import { CSSTransition } from 'react-transition-group'

const TransitionWrapper = ({ appear, animationType, children }) => {
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
