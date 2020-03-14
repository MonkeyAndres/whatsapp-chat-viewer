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
        {chat.messages.map((msg, i) => {
          const isMine = selectedContact === msg.sender

          return isMine ? (
            <div key={i} className="message mine">
              <pre className="content">{msg.message}</pre>
              <span className="date">{dateToLocateTimeString(msg.date)}</span>
            </div>
          ) : (
            <div key={i} className="message others">
              {isGroup ? <p className="sender">{msg.sender}</p> : null}
              <pre className="content">{msg.message}</pre>
              <span className="date">{dateToLocateTimeString(msg.date)}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Chat
