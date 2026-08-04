const UNSUPPORTED_CHAT_ERROR = [
  'Select a WhatsApp .txt export.',
  'Supported lines start like "[13/2/2024, 15:04:05] Name: message" or "13/2/24, 3:04 PM - Name: message".',
  'Your chat stays in this browser. Try exporting the chat without media and selecting the .txt file again.',
].join(' ')

const FORMAT_MARKS_REGEXP = /[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g

const DATE_REGEXP = '(\\d{1,2})\\/(\\d{1,2})\\/(\\d{2,4})'
const TIME_REGEXP = '(\\d{1,2}):(\\d{2})(?::(\\d{2}))?\\s*(AM|PM|a\\.\\s*m\\.|p\\.\\s*m\\.)?'

const MESSAGE_START_REGEXP = new RegExp(
  '^\\s*(?:\\[)?' +
    DATE_REGEXP +
    ',\\s*' +
    TIME_REGEXP +
    '(?:\\])?\\s*(?:-\\s*)?(.*)$',
  'i'
)

const normalizeSyntax = value => value.replace(FORMAT_MARKS_REGEXP, '')

const normalizeYear = year => {
  const parsedYear = Number(year)

  if (year.length === 2) {
    return parsedYear >= 70 ? 1900 + parsedYear : 2000 + parsedYear
  }

  return parsedYear
}

const normalizeHour = (hour, marker) => {
  const parsedHour = Number(hour)

  if (!marker) {
    return parsedHour
  }

  const normalizedMarker = marker.toLowerCase().replace(/\s|\./g, '')

  if (normalizedMarker === 'pm') {
    return parsedHour === 12 ? 12 : parsedHour + 12
  }

  return parsedHour === 12 ? 0 : parsedHour
}

const getDateByParts = ({ day, month, year, hours, minutes, seconds, marker }) => {
  const date = new Date(
    Date.UTC(
      normalizeYear(year),
      Number(month) - 1,
      Number(day),
      normalizeHour(hours, marker),
      Number(minutes),
      Number(seconds || 0)
    )
  )

  const isValidDate =
    date.getUTCFullYear() === normalizeYear(year) &&
    date.getUTCMonth() === Number(month) - 1 &&
    date.getUTCDate() === Number(day)

  if (!isValidDate) {
    throw new Error(UNSUPPORTED_CHAT_ERROR)
  }

  return date
}

const splitSenderAndMessage = content => {
  const senderMatch = content.match(/^([^:\n]{1,120}):\s*([\s\S]*)$/)

  if (!senderMatch) {
    return {
      sender: null,
      message: content.trim(),
      type: 'system',
    }
  }

  return {
    sender: senderMatch[1].trim(),
    message: senderMatch[2],
    type: 'chat',
  }
}

const parseMessageStart = line => {
  const match = normalizeSyntax(line).match(MESSAGE_START_REGEXP)

  if (!match) {
    return null
  }

  const [, day, month, year, hours, minutes, seconds, marker, content] = match

  return {
    date: getDateByParts({ day, month, year, hours, minutes, seconds, marker }),
    ...splitSenderAndMessage(content),
  }
}

const unsupportedChatError = () => new Error(UNSUPPORTED_CHAT_ERROR)

export const parseMessages = input => {
  const lines = input.split(/\r?\n/)
  const parsedMessages = []

  lines.forEach(line => {
    const messageStart = parseMessageStart(line)

    if (messageStart) {
      parsedMessages.push({
        id: parsedMessages.length,
        ...messageStart,
      })
      return
    }

    const currentMessage = parsedMessages[parsedMessages.length - 1]

    if (currentMessage) {
      currentMessage.message = `${currentMessage.message}\n${line}`
    }
  })

  if (parsedMessages.length === 0) {
    throw unsupportedChatError()
  }

  return parsedMessages
}

export const parseContacts = (messages) => {
  const uniqContacts = new Set()

  messages.forEach((msg) => {
    if (msg.type !== 'chat') return
    if(uniqContacts.has(msg.sender)) return

    uniqContacts.add(msg.sender)
  })

  return Array.from(uniqContacts)
}
