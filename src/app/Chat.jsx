import React from 'react'
import ChatView from '../ui/main/ChatView'
import ChatMessage from '../ui/main/ChatMessage'
import VisibilitySensor from 'react-visibility-sensor'
import { useCallback } from 'react'
import useChatState from './useChatState'

const Chat = ({ chat, selectedContact, goBack }) => {
  const {
    hasMoreMessages,
    loadPrevious,
    messages,
    messageRefs,
    isGroupChat
  } = useChatState({
    chat: chat,
    messagesPerPage: 100
  })

  const renderMessage = useCallback(
    msg => {
      const isMine = msg.sender === selectedContact

      return (
        <ChatMessage
          key={msg.id}
          msg={msg}
          msgRef={messageRefs[msg.id]}
          isMine={isMine}
          isGroup={isGroupChat}
        />
      )
    },
    [isGroupChat, messageRefs, selectedContact]
  )

  return (
    <div className="card chat">
      <ChatView
        header={chat?.header}
        goBack={goBack}
        chatSlot={
          <>
            {hasMoreMessages && (
              <VisibilitySensor onChange={loadPrevious} delayedCall={true}>
                <div className="loader"></div>
              </VisibilitySensor>
            )}

            {messages.map(renderMessage)}
          </>
        }
      />
    </div>
  )
}

export default Chat
