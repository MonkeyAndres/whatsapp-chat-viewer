import React, { useReducer, useLayoutEffect, useCallback } from 'react'
import * as R from 'ramda'

const initState = ({ chat, messagesPerPage }) => {
  const allMessages = chat.messages

  const filteredMessages = R.takeLast(messagesPerPage, allMessages)

  return {
    allMessages,
    messagesPerPage,
    messages: filteredMessages,
    messageRefs: allMessages.reduce(
      (acc, msg) => ({ ...acc, [msg.id]: React.createRef() }),
      {}
    ),
    hasMoreMessages: allMessages.length !== filteredMessages.length,
    isGroupChat: chat.contacts.length > 2,
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

const useChatState = ({ chat, messagesPerPage }) => {
  const [state, dispatch] = useReducer(
    reducer,
    { chat, messagesPerPage },
    initState
  )

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

  return {
    loadPrevious,
    ...state
  }
}

export default useChatState
