import React from 'react'
import { ReactComponent as BackArrow } from '../../assets/icons/arrow-left.svg'

const ChatView = ({ header, goBack, chatSlot }) => {
  return (
    <div className="chatView">
      <div className="chatView-header">
        <BackArrow className="back-arrow" onClick={goBack} />
        <h3 className="header-text">{header}</h3>
      </div>

      <div className="chatView-container">{chatSlot}</div>
    </div>
  )
}

export default ChatView
