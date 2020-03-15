import React from 'react'
import ChatMessage from './ChatMessage'

const ChatView = ({ chat, selectedContact, goBack }) => {
  const isGroup = chat.contacts.length > 2

  return (
    <>
      <div className="chat-header">
        <h1>{chat.header}</h1>
        <span className="back-button" onClick={goBack}>
          Go back
        </span>
      </div>
      <div className="chat-grid">
        {chat.messages.map((msg, i) => {
          const isMine = selectedContact === msg.sender

          return (
            <ChatMessage key={i} msg={msg} isMine={isMine} isGroup={isGroup} />
          )
        })}
      </div>
    </>
  )
}

export default ChatView
