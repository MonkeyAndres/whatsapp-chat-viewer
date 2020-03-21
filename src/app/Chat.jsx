import React, { useRef, useLayoutEffect, useReducer } from 'react'
import * as R from 'ramda'
import ChatView from '../ui/main/ChatView'
import ChatMessage from '../ui/main/ChatMessage'
import VisibilitySensor from 'react-visibility-sensor'
import { useCallback } from 'react'

const initState = ({ messages, messagesPerPage }) => {
  const filteredMessages = R.takeLast(messagesPerPage, messages)

  return {
    allMessages: messages,
    messagesPerPage,
    messages: filteredMessages,
    messageRefs: messages.reduce(
      (acc, msg) => ({ ...acc, [msg.id]: React.createRef() }),
      {}
    ),
    hasMoreMessages: messages.length !== filteredMessages.length,
    page: 1
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'loadPrevious': {
      const nextPage = state.page + 1
      const nextMessages = R.takeLast(
        state.messagesPerPage * nextPage,
        state.allMessages
      )

      return {
        ...state,
        page: nextPage,
        messages: nextMessages,
        hasMoreMessages: state.allMessages.length !== nextMessages.length
      }
    }

    default:
      throw new Error()
  }
}

const Chat = ({ chat, selectedContact, goBack }) => {
  const [state, dispatch] = useReducer(
    reducer,
    { messages: chat.messages, messagesPerPage: 100 },
    initState
  )

  const isGroup = chat.contacts.length > 2

  const scrollerRef = useRef()

  useLayoutEffect(() => {
    const allMessageCount = state.allMessages.length
    const latestMessageIndex =
      allMessageCount - (state.page - 1) * state.messagesPerPage
    const lastMessage = state.messageRefs[latestMessageIndex]

    lastMessage.current.scrollIntoView(true)
  }, [
    state.allMessages.length,
    state.messageRefs,
    state.messagesPerPage,
    state.page
  ])

  const loadPrevious = useCallback(isVisible => {
    if (isVisible) {
      setTimeout(() => dispatch({ type: 'loadPrevious' }), 500)
    }
  }, [])

  return (
    <div className="card chat" ref={scrollerRef}>
      <ChatView
        header={chat?.header}
        goBack={goBack}
        chatSlot={
          <>
            {state.hasMoreMessages && (
              <VisibilitySensor onChange={loadPrevious} delayedCall={true}>
                <div className="intersection-observer"></div>
              </VisibilitySensor>
            )}

            {state.messages.map(msg => {
              const isMine = msg.sender === selectedContact

              return (
                <ChatMessage
                  key={msg.id}
                  msg={msg}
                  msgRef={state.messageRefs[msg.id]}
                  isMine={isMine}
                  isGroup={isGroup}
                />
              )
            })}
          </>
        }
      />
    </div>
  )
}

export default Chat
