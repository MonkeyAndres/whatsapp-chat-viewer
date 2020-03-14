import React, { useLayoutEffect } from 'react'
import { dateToLocateTimeString } from './utils'

const Chat = ({ chat, selectedContact, scrollerRef }) => {
  const isGroup = chat.contacts.length > 2

  useLayoutEffect(() => {
    const scrollerElement = scrollerRef.current
    scrollerElement.scrollTop = scrollerElement.scrollHeight
  }, [scrollerRef])

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
            <span className="content">{msg.message}</span>
            <span className="date">{dateToLocateTimeString(msg.date)}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export default Chat
