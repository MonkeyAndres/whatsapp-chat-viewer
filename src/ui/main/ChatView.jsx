import React from 'react'
import ChatMessage from './ChatMessage'

const ChatView = ({ chat, selectedContact }) => {
  const isGroup = chat.contacts.length > 2

  return (
    <>
      <h1 className="chat-header">{chat.header}</h1>
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
