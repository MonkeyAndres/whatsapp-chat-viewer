import React, { useLayoutEffect } from 'react'
import ChatView from '../ui/main/ChatView'

const Chat = ({ chat, selectedContact, scrollerRef, goBack }) => {
  useLayoutEffect(() => {
    const scrollerElement = scrollerRef.current
    scrollerElement.scrollTop = scrollerElement.scrollHeight
  }, [scrollerRef])

  return (
    <ChatView chat={chat} selectedContact={selectedContact} goBack={goBack} />
  )
}

export default Chat
