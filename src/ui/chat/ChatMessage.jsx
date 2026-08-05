import React from 'react'
import { dateToLocateTimeString } from '../../app/utils'

const ChatMessage = ({ msg, msgRef, isMine, isGroup }) => {
  if (msg.type === 'system') {
    return (
      <div className="chatMessageRow" data-testid="message-row" ref={msgRef}>
        <div className="message system">
          <pre className="content">{msg.message}</pre>
          <span className="date">{dateToLocateTimeString(msg.date)}</span>
        </div>
      </div>
    )
  }

  const messageClassName = isMine ? 'mine' : 'others'

  return (
    <div className="chatMessageRow" data-testid="message-row" ref={msgRef}>
      <div className={`message ${messageClassName}`}>
        {isGroup && !isMine ? <p className="sender">{msg.sender}</p> : null}
        <pre className="content">{msg.message}</pre>
        <span className="date">{dateToLocateTimeString(msg.date)}</span>
      </div>
    </div>
  )
}

export default ChatMessage
