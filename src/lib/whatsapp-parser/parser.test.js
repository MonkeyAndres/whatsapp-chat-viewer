import parseWhatsappChat from './index'
import {
  createParserDiagnostic,
  inferDateConvention,
  parseMessages,
  tokenizeMessageStarts,
} from './parser'

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

  test('infers legacy United States month/day/year exports at chat level', () => {
    const chat = parseWhatsappChat(
      [
        '5/16/16, 19:48 - Messages and calls are end-to-end encrypted.',
        '5/16/16, 19:49 - Alice Example: Hello from a synthetic export',
        '5/16/16, 19:50 - Bob Example: <Media omitted>',
      ].join('\n')
    )

    expect(chat.messages).toEqual([
      {
        id: 1,
        date: new Date(Date.UTC(2016, 4, 16, 19, 49, 0)),
        sender: 'Alice Example',
        message: 'Hello from a synthetic export',
        type: 'chat',
      },
      {
        id: 2,
        date: new Date(Date.UTC(2016, 4, 16, 19, 50, 0)),
        sender: 'Bob Example',
        message: '<Media omitted>',
        type: 'chat',
      },
    ])
  })

  test('uses one unambiguous M/D/Y signal for later ambiguous dates', () => {
    const messages = parseMessages(
      [
        '5/16/16, 7:49 PM - Alice Example: Unambiguous US date',
        '5/6/16, 7:50 PM - Bob Example: Ambiguous date follows the chat convention',
      ].join('\n')
    )

    expect(messages.map(message => message.date.toISOString())).toEqual([
      '2016-05-16T19:49:00.000Z',
      '2016-05-06T19:50:00.000Z',
    ])
  })

  test('reports contradictory date evidence instead of mixing conventions', () => {
    expect(() =>
      parseMessages(
        [
          '5/16/16, 7:49 PM - Alice Example: M/D/Y evidence',
          '16/5/16, 19:50 - Bob Example: D/M/Y evidence',
        ].join('\n')
      )
    ).toThrow('Select a WhatsApp .txt export')

    const diagnostic = createParserDiagnostic(
      [
        '5/16/16, 7:49 PM - Alice Example: M/D/Y evidence',
        '16/5/16, 19:50 - Bob Example: D/M/Y evidence',
      ].join('\n')
    )

    expect(diagnostic).toEqual({
      lineCount: 2,
      candidateCount: 2,
      recognizedCount: 2,
      dateConvention: null,
      conventionStatus: 'conflict',
      stableCause: 'Conflicting day/month evidence was found across the chat.',
    })
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

  test('keeps tokenization and convention inference testable without chat content', () => {
    const tokens = tokenizeMessageStarts(
      [
        '\u200e5/16/16, 7:49 PM - Alice Example: Synthetic text',
        '5/6/16, 7:50 PM - Bob Example: More synthetic text',
      ].join('\n')
    )
    const inference = inferDateConvention(tokens)

    expect(tokens).toHaveLength(2)
    expect(tokens[0]).toMatchObject({
      lineIndex: 0,
      firstDatePart: '5',
      secondDatePart: '16',
      year: '16',
      hours: '7',
      minutes: '49',
      marker: 'PM',
      content: 'Alice Example: Synthetic text',
    })
    expect(inference).toMatchObject({
      convention: { id: 'MDY' },
      status: 'inferred',
      stableCause: 'An unambiguous M/D/Y date appears in the chat.',
      validTokenCount: 2,
    })
  })
})
