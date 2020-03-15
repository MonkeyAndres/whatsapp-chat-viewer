import React from 'react'
import { dateToLocateTimeString } from '../../app/utils'

const ChatMessage = ({ style, msg, isMine, isGroup }) => {
  const messageClassName = isMine ? 'mine' : 'others'

  return (
    <div className={`message ${messageClassName}`} style={style}>
      {isGroup && !isMine ? <p className="sender">{msg.sender}</p> : null}
      <pre className="content">{msg.message}</pre>
      <span className="date">{dateToLocateTimeString(msg.date)}</span>
    </div>
  )
}

export default ChatMessage
