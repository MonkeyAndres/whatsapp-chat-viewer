import React, { useCallback } from 'react'
import ChatView from '../ui/main/ChatView'
import {
  CellMeasurerCache,
  CellMeasurer,
  AutoSizer,
  List
} from 'react-virtualized'
import ChatMessage from '../ui/main/ChatMessage'

const Chat = ({ chat, selectedContact, goBack }) => {
  const isGroup = chat.contacts.length > 2

  const cellMeasureCache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 40
  })

  const rowRenderer = useCallback(
    ({ key, index, style, parent }) => {
      const message = chat.messages[index]
      const isMine = selectedContact === message.sender

      return (
        <CellMeasurer
          key={key}
          cache={cellMeasureCache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          <ChatMessage
            style={style}
            msg={message}
            isMine={isMine}
            isGroup={isGroup}
          />
        </CellMeasurer>
      )
    },
    [cellMeasureCache, chat.messages, isGroup, selectedContact]
  )

  return (
    <div className="card chat">
      <ChatView
        header={chat.header}
        goBack={goBack}
        chatContentSlot={
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                width={width}
                rowCount={chat.messages.length}
                deferredMeasurementCache={cellMeasureCache}
                rowHeight={cellMeasureCache.rowHeight}
                rowRenderer={rowRenderer}
                overscanRowCount={100}
                estimatedRowSize={40}
                scrollToIndex={chat.messages.length}
              />
            )}
          </AutoSizer>
        }
      />
    </div>
  )
}

export default Chat
