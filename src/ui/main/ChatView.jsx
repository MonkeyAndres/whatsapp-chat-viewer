import React from 'react'

const ChatView = ({ header, goBack, chatSlot }) => {
  return (
    <>
      <div className="chat-header">
        <h1>{header}</h1>
        <span className="back-button" onClick={goBack}>
          Go back
        </span>
      </div>

      <div className="chat-grid">{chatSlot}</div>
    </>
  )
}

export default ChatView
