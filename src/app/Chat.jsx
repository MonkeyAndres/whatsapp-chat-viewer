import React, { useRef, useLayoutEffect } from 'react'
import ChatView from '../ui/main/ChatView'

const Chat = ({ chat, selectedContact, goBack }) => {
  const isGroup = chat.contacts.length > 2

  const scrollerRef = useRef()

  useLayoutEffect(() => {
    const element = scrollerRef.current
    element.scrollTop = element.scrollHeight
  }, [])

  return (
    <div className="card chat" ref={scrollerRef}>
      <ChatView
        header={chat?.header}
        messages={chat?.messages}
        isGroup={isGroup}
        selectedContact={selectedContact}
        goBack={goBack}
      />
    </div>
  )
}

export default Chat
