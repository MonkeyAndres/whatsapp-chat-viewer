import React from 'react'
import * as R from 'ramda'
import { dateToLocateTimeString } from '../../app/utils'

const ChatMessage = ({ style, msg, isMine, isGroup }) => {
  const messageClassName = isMine ? 'mine' : 'others'

  const filteredStyles = R.omit(['width', 'left'], style)

  return (
    // HACK: Needed in order to have padding between rows
    <div
      style={filteredStyles}
      className={`message-container-${messageClassName}`}
    >
      <div className={`message ${messageClassName}`}>
        {isGroup && !isMine ? <p className="sender">{msg.sender}</p> : null}
        <pre className="content">{msg.message}</pre>
        <span className="date">{dateToLocateTimeString(msg.date)}</span>
      </div>
    </div>
  )
}

export default ChatMessage
