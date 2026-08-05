import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import Chat from './Chat'
import { I18nProvider, LANGUAGE_STORAGE_KEY } from './i18n'

jest.mock('react-virtuoso', () => ({
  Virtuoso: ({
    alignToBottom,
    data,
    initialTopMostItemIndex,
    itemContent,
    computeItemKey,
  }) => {
    const windowSize = 30
    const anchorIndex = typeof initialTopMostItemIndex === 'number'
      ? initialTopMostItemIndex
      : initialTopMostItemIndex.index
    const start = initialTopMostItemIndex.align === 'end'
      ? Math.max(0, data.length - windowSize)
      : Math.max(0, anchorIndex)
    const visibleMessages = data.slice(start, start + windowSize)

    return (
      <div
        data-testid="virtual-chat"
        data-align-to-bottom={String(alignToBottom)}
        data-initial-index={String(anchorIndex)}
        data-initial-align={initialTopMostItemIndex.align}
      >
        {visibleMessages.map((message, offset) => {
          const index = start + offset
          return (
            <div key={computeItemKey(index, message)}>
              {itemContent(index, message)}
            </div>
          )
        })}
      </div>
    )
  },
}))

const twoPersonChat = {
  header: 'WhatsApp Chat',
  contacts: ['Alice Example', 'Bob Example'],
  messages: [
    {
      id: 0,
      date: new Date(Date.UTC(2016, 4, 16, 19, 48, 0)),
      sender: null,
      message: 'Messages and calls are end-to-end encrypted.',
      type: 'system',
    },
    {
      id: 1,
      date: new Date(Date.UTC(2016, 4, 16, 19, 49, 0)),
      sender: 'Alice Example',
      message: 'Hello',
      type: 'chat',
    },
    {
      id: 2,
      date: new Date(Date.UTC(2016, 4, 16, 19, 50, 0)),
      sender: 'Bob Example',
      message: 'Hi',
      type: 'chat',
    },
  ],
}

describe('Chat', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test('uses the other participant as the header in a two-person chat', () => {
    const { getByRole, getByText } = render(
      <Chat
        chat={twoPersonChat}
        selectedContact="Alice Example"
        goBack={() => {}}
      />
    )

    expect(getByRole('heading', { name: 'Bob Example' })).toBeInTheDocument()
    expect(getByText('Messages and calls are end-to-end encrypted.')).toBeInTheDocument()
    expect(getByText('Hello')).toBeInTheDocument()
    expect(getByText('Hi')).toBeInTheDocument()
  })

  test('does not translate imported participant names or message content', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es')

    const { getByRole, getByText } = render(
      <I18nProvider>
        <Chat
          chat={twoPersonChat}
          selectedContact="Alice Example"
          goBack={() => {}}
        />
      </I18nProvider>
    )

    expect(getByRole('heading', { name: 'Bob Example' })).toBeInTheDocument()
    expect(getByText('Messages and calls are end-to-end encrypted.')).toBeInTheDocument()
    expect(getByText('Hello')).toBeInTheDocument()
    expect(getByText('Hi')).toBeInTheDocument()
  })

  test('opens latest messages at the newest message anchored to the bottom by default', () => {
    const chat = buildLargeChat(10000)

    const { getByTestId, getByText, queryByText, queryAllByTestId } = render(
      <Chat
        chat={chat}
        selectedContact="Alice Example"
        goBack={() => {}}
      />
    )

    const virtualChat = getByTestId('virtual-chat')

    expect(virtualChat).toHaveAttribute('data-initial-index', '9999')
    expect(virtualChat).toHaveAttribute('data-initial-align', 'end')
    expect(virtualChat).toHaveAttribute('data-align-to-bottom', 'true')
    expect(getByText('Synthetic message 9999')).toBeInTheDocument()
    expect(queryByText('Synthetic message 0')).not.toBeInTheDocument()
    expect(queryAllByTestId('message-row')).toHaveLength(30)
  })

  test('switches deterministically to the oldest message without reversing chronological order', () => {
    const chat = buildLargeChat(10000)

    const { getByRole, getByTestId, getByText, queryByText, queryAllByTestId } = render(
      <Chat
        chat={chat}
        selectedContact="Alice Example"
        goBack={() => {}}
      />
    )

    fireEvent.click(getByRole('button', { name: 'From the beginning' }))

    const virtualChat = getByTestId('virtual-chat')
    const rows = queryAllByTestId('message-row')

    expect(virtualChat).toHaveAttribute('data-initial-index', '0')
    expect(virtualChat).toHaveAttribute('data-initial-align', 'start')
    expect(virtualChat).toHaveAttribute('data-align-to-bottom', 'false')
    expect(getByText('Synthetic message 0')).toBeInTheDocument()
    expect(getByText('Synthetic message 29')).toBeInTheDocument()
    expect(queryByText('Synthetic message 9999')).not.toBeInTheDocument()
    expect(rows[0]).toHaveTextContent('Synthetic message 0')
    expect(rows[29]).toHaveTextContent('Synthetic message 29')
    expect(rows).toHaveLength(30)
  })

  test('switches back to latest messages without an empty render', () => {
    const chat = buildLargeChat(10000)

    const { getByRole, getByTestId, getByText, queryByText } = render(
      <I18nProvider>
        <Chat
          chat={chat}
          selectedContact="Alice Example"
          goBack={() => {}}
        />
      </I18nProvider>
    )

    fireEvent.click(getByRole('button', { name: 'From the beginning' }))
    fireEvent.click(getByRole('button', { name: 'Latest messages' }))

    const virtualChat = getByTestId('virtual-chat')

    expect(virtualChat).toHaveAttribute('data-initial-index', '9999')
    expect(virtualChat).toHaveAttribute('data-initial-align', 'end')
    expect(getByText('Synthetic message 9999')).toBeInTheDocument()
    expect(queryByText('Synthetic message 0')).not.toBeInTheDocument()
  })
})

const buildLargeChat = (messageCount) => ({
  header: 'Large WhatsApp Chat',
  contacts: ['Alice Example', 'Bob Example'],
  messages: Array.from({ length: messageCount }, (_, index) => ({
    id: index,
    date: new Date(Date.UTC(2016, 4, 16, 19, index % 60, 0)),
    sender: index % 2 === 0 ? 'Alice Example' : 'Bob Example',
    message: `Synthetic message ${index}`,
    type: 'chat',
  })),
})
