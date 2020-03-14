import React from 'react'

const Chat = ({ chat, selectedContact }) => {
  const isGroup = chat.contacts.length > 2

  return (
    <>
      <h1 className="chat-header">Chat Content</h1>
      <div className="chat-grid">
        {chat.messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${
              selectedContact === msg.sender ? 'mine' : 'others'
            }`}
          >
            <p className="content">{msg.message}</p>
            <span className="date">14:00</span>
          </div>
        ))}
      </div>
    </>
  )
}

export default Chat
