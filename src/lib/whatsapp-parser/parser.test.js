import parseWhatsappChat from './index'
import { parseMessages } from './parser'

describe('WhatsApp parser', () => {
  test('parses legacy bracket format with seconds', () => {
    const chat = parseWhatsappChat(
      [
        '[01/02/2024, 03:04:05] Messages and calls are end-to-end encrypted.',
        '[01/02/2024, 03:05:06] Alice: One',
        '[01/02/2024, 03:06:07] Bob: Two',
      ].join('\n')
    )

    expect(chat.header).toBe('Messages and calls are end-to-end encrypted.')
    expect(chat.contacts).toEqual(['Alice', 'Bob'])
    expect(chat.messages).toEqual([
      {
        id: 1,
        date: new Date(Date.UTC(2024, 1, 1, 3, 5, 6)),
        sender: 'Alice',
        message: 'One',
        type: 'chat',
      },
      {
        id: 2,
        date: new Date(Date.UTC(2024, 1, 1, 3, 6, 7)),
        sender: 'Bob',
        message: 'Two',
        type: 'chat',
      },
    ])
  })

  test('parses current Android dash format with optional seconds', () => {
    const chat = parseWhatsappChat(
      [
        '13/2/24, 3:04 PM - Messages and calls are end-to-end encrypted.',
        '13/2/24, 3:05 PM - Alice: Hi from Android',
        '13/2/24, 3:06:07 PM - Bob: Seconds still work',
      ].join('\n')
    )

    expect(chat.header).toBe('Messages and calls are end-to-end encrypted.')
    expect(chat.contacts).toEqual(['Alice', 'Bob'])
    expect(chat.messages.map(({ sender, message, date }) => ({
      sender,
      message,
      date: date.toISOString(),
    }))).toEqual([
      {
        sender: 'Alice',
        message: 'Hi from Android',
        date: '2024-02-13T15:05:00.000Z',
      },
      {
        sender: 'Bob',
        message: 'Seconds still work',
        date: '2024-02-13T15:06:07.000Z',
      },
    ])
  })

  test('parses current iOS format with common unicode marks', () => {
    const chat = parseWhatsappChat(
      [
        '\u200e1/2/24, 3:04:05 PM Messages and calls are end-to-end encrypted.',
        '\u200e1/2/24, 3:05:06 PM Alice: Hi from iOS',
        '\u202a1/2/24, 3:06 PM Bob: Unicode marks are ignored\u202c',
      ].join('\n')
    )

    expect(chat.contacts).toEqual(['Alice', 'Bob'])
    expect(chat.messages.map(({ sender, message }) => ({ sender, message }))).toEqual([
      { sender: 'Alice', message: 'Hi from iOS' },
      { sender: 'Bob', message: 'Unicode marks are ignored' },
    ])
  })

  test('preserves order and all multiline message text', () => {
    const chat = parseWhatsappChat(
      [
        '1/2/24, 3:04 PM - Messages and calls are end-to-end encrypted.',
        '1/2/24, 3:05 PM - Alice: First line',
        'second line',
        '[not a new message]',
        '1/2/24, 3:06 PM - Bob: Next message',
      ].join('\n')
    )

    expect(chat.messages.map((message) => message.message)).toEqual([
      'First line\nsecond line\n[not a new message]',
      'Next message',
    ])
  })

  test('keeps system messages out of the contact list', () => {
    const chat = parseWhatsappChat(
      [
        '1/2/24, 3:04 PM - Messages and calls are end-to-end encrypted.',
        '1/2/24, 3:05 PM - Alice: Hello',
        '1/2/24, 3:06 PM - Bob changed this group\'s icon',
        '1/2/24, 3:07 PM - Bob: Still a contact',
      ].join('\n')
    )

    expect(chat.contacts).toEqual(['Alice', 'Bob'])
    expect(chat.messages.map((message) => message.type)).toEqual([
      'chat',
      'system',
      'chat',
    ])
  })

  test('does not drop the first chat message when no system header exists', () => {
    const chat = parseWhatsappChat(
      [
        '1/2/24, 3:05 PM - Alice: First exported line',
        '1/2/24, 3:06 PM - Bob: Second exported line',
      ].join('\n')
    )

    expect(chat.header).toBe('WhatsApp Chat')
    expect(chat.messages.map((message) => message.message)).toEqual([
      'First exported line',
      'Second exported line',
    ])
  })

  test('rejects unsupported files with a human safe message', () => {
    expect(() => parseMessages('not a WhatsApp export')).toThrow(
      'Select a WhatsApp .txt export'
    )
  })
})
