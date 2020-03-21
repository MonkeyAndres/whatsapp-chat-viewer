import React, { useRef, useLayoutEffect, useReducer } from 'react'
import * as R from 'ramda'
import ChatView from '../ui/main/ChatView'
import ChatMessage from '../ui/main/ChatMessage'

const initState = ({ messages, messagesPerPage }) => ({
  allMessages: messages,
  messagesPerPage,
  messages: R.takeLast(messagesPerPage, messages),
  messageRefs: messages.reduce(
    (acc, msg) => ({ ...acc, [msg.id]: React.createRef() }),
    {}
  ),
  page: 1
})

const reducer = (state, action) => {
  switch (action.type) {
    case 'loadPrevious': {
      const nextPage = state.page + 1

      return {
        ...state,
        page: nextPage,
        messages: R.takeLast(
          state.messagesPerPage * nextPage,
          state.allMessages
        )
      }
    }

    default:
      throw new Error()
  }
}

const Chat = ({ chat, selectedContact, goBack }) => {
  const [state, dispatch] = useReducer(
    reducer,
    { messages: chat.messages, messagesPerPage: 50 },
    initState
  )

  const isGroup = chat.contacts.length > 2

  const scrollerRef = useRef()

  useLayoutEffect(() => {
    const allMessageCount = state.allMessages.length
    const latestMessageIndex = allMessageCount - (state.page - 1) * 50
    const lastMessage = state.messageRefs[latestMessageIndex]

    scrollerRef.current.scrollTop = lastMessage.current.offsetTop
  }, [state.allMessages.length, state.messageRefs, state.page])

  return (
    <div className="card chat" ref={scrollerRef}>
      <ChatView
        header={chat?.header}
        goBack={goBack}
        chatSlot={
          <>
            <button
              className="intersection-observer"
              onClick={() => dispatch({ type: 'loadPrevious' })}
            ></button>

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
