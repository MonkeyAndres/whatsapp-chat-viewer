import React from 'react'
import { render } from '@testing-library/react'
import Chat from './Chat'
import { I18nProvider, LANGUAGE_STORAGE_KEY } from './i18n'

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
})
