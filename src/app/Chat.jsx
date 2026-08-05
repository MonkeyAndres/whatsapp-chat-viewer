import React, { useCallback, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import ChatView from '../ui/chat/ChatView'
import ChatMessage from '../ui/chat/ChatMessage'
import { CHAT_READ_MODES } from './chatReadModes'

const getConversationHeader = ({ chat, selectedContact }) => {
  if (chat?.contacts?.length === 2) {
    const otherContact = chat.contacts.find(contact => contact !== selectedContact)
    return otherContact || chat.header
  }

  return chat?.header
}

const Chat = ({ chat, selectedContact, goBack }) => {
  const [readMode, setReadMode] = useState(CHAT_READ_MODES.latest)

  const messages = chat.messages
  const isGroupChat = chat.contacts.length > 2

  const renderMessage = useCallback(
    (index, msg) => {
      const isMine = msg.sender === selectedContact

      return (
        <ChatMessage
          msg={msg}
          isMine={isMine}
          isGroup={isGroupChat}
        />
      )
    },
    [isGroupChat, selectedContact]
  )

  const getMessageKey = useCallback(
    (index, msg) => msg.id,
    []
  )

  const initialTopMostItemIndex = readMode === CHAT_READ_MODES.latest
    ? { index: messages.length - 1, align: 'end' }
    : { index: 0, align: 'start' }

  const virtualChat = (
    <Virtuoso
      key={readMode}
      className="chatVirtuoso"
      data={messages}
      computeItemKey={getMessageKey}
      initialTopMostItemIndex={initialTopMostItemIndex}
      alignToBottom={readMode === CHAT_READ_MODES.latest}
      overscan={600}
      itemContent={renderMessage}
    />
  )

  return (
    <ChatView
      header={getConversationHeader({ chat, selectedContact })}
      goBack={goBack}
      readMode={readMode}
      onReadModeChange={setReadMode}
      chatSlot={virtualChat}
    />
  )
}

export default Chat
