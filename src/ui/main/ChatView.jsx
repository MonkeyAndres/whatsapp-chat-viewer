import React from 'react'
import ChatMessage from './ChatMessage'

const ChatView = ({ header, messages, isGroup, selectedContact, goBack }) => {
  return (
    <>
      <div className="chat-header">
        <h1>{header}</h1>
        <span className="back-button" onClick={goBack}>
          Go back
        </span>
      </div>

      <div className="chat-grid">
        {messages.map(msg => {
          const isMine = msg.sender === selectedContact

          return (
            <ChatMessage
              key={msg.id}
              msg={msg}
              isMine={isMine}
              isGroup={isGroup}
            />
          )
        })}
      </div>
    </>
  )
}

export default ChatView
