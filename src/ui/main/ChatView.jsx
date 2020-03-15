import React from 'react'

const ChatView = ({ header, goBack, chatContentSlot }) => {
  return (
    <>
      <div className="chat-header">
        <h1>{header}</h1>
        <span className="back-button" onClick={goBack}>
          Go back
        </span>
      </div>

      <div className="chat-container">{chatContentSlot}</div>
    </>
  )
}

export default ChatView
