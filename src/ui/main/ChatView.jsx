import React from 'react'
import { ReactComponent as BackArrow } from '../../assets/icons/arrow-left.svg'

const ChatView = ({ header, goBack, chatSlot }) => {
  return (
    <>
      <div className="chat-header">
        <BackArrow className="back-arrow" onClick={goBack} />
        <span className="header-text">{header}</span>
      </div>

      <div className="chat-grid">{chatSlot}</div>
    </>
  )
}

export default ChatView
