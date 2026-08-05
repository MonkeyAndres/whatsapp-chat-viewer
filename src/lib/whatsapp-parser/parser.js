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

const DATE_CONVENTIONS = {
  DMY: {
    id: 'DMY',
    firstPart: 'day',
    secondPart: 'month',
  },
  MDY: {
    id: 'MDY',
    firstPart: 'month',
    secondPart: 'day',
  },
}

const normalizeInput = value =>
  String(value || '')
    .replace(FORMAT_MARKS_REGEXP, '')
    .replace(/\r\n?/g, '\n')

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

const isValidTime = ({ hours, minutes, seconds, marker }) => {
  const parsedHours = Number(hours)
  const parsedMinutes = Number(minutes)
  const parsedSeconds = Number(seconds || 0)

  if (parsedMinutes > 59 || parsedSeconds > 59) {
    return false
  }

  if (marker) {
    return parsedHours >= 1 && parsedHours <= 12
  }

  return parsedHours >= 0 && parsedHours <= 23
}

const getDatePartsForConvention = (token, convention) => {
  const firstPart = Number(token.firstDatePart)
  const secondPart = Number(token.secondDatePart)

  if (convention.id === 'MDY') {
    return {
      day: secondPart,
      month: firstPart,
      year: normalizeYear(token.year),
    }
  }

  return {
    day: firstPart,
    month: secondPart,
    year: normalizeYear(token.year),
  }
}

const isValidDateForConvention = (token, convention) => {
  if (!isValidTime(token)) {
    return false
  }

  const { day, month, year } = getDatePartsForConvention(token, convention)
  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

const getTokenDateSignal = token => {
  const canUseDMY = isValidDateForConvention(token, DATE_CONVENTIONS.DMY)
  const canUseMDY = isValidDateForConvention(token, DATE_CONVENTIONS.MDY)

  if (canUseDMY && !canUseMDY) return 'DMY'
  if (canUseMDY && !canUseDMY) return 'MDY'
  if (canUseDMY && canUseMDY) return 'ambiguous'

  return 'invalid'
}

const materializeDate = (token, convention) => {
  const { day, month, year } = getDatePartsForConvention(token, convention)

  return new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      normalizeHour(token.hours, token.marker),
      Number(token.minutes),
      Number(token.seconds || 0)
    )
  )
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

export const tokenizeMessageStarts = input => {
  const lines = normalizeInput(input).split('\n')

  return lines.reduce((tokens, line, lineIndex) => {
    const match = line.match(MESSAGE_START_REGEXP)

    if (!match) {
      return tokens
    }

    const [, firstDatePart, secondDatePart, year, hours, minutes, seconds, marker, content] = match

    tokens.push({
      lineIndex,
      firstDatePart,
      secondDatePart,
      year,
      hours,
      minutes,
      seconds,
      marker,
      content,
      signal: null,
    })

    return tokens
  }, [])
}

export const inferDateConvention = tokens => {
  const tokenSignals = tokens.map(token => getTokenDateSignal(token))
  const hasDMYSignal = tokenSignals.includes('DMY')
  const hasMDYSignal = tokenSignals.includes('MDY')
  const validTokenCount = tokenSignals.filter(signal => signal !== 'invalid').length

  if (hasDMYSignal && hasMDYSignal) {
    return {
      convention: null,
      status: 'conflict',
      stableCause: 'Conflicting day/month evidence was found across the chat.',
      tokenSignals,
      validTokenCount,
    }
  }

  if (hasMDYSignal) {
    return {
      convention: DATE_CONVENTIONS.MDY,
      status: 'inferred',
      stableCause: 'An unambiguous M/D/Y date appears in the chat.',
      tokenSignals,
      validTokenCount,
    }
  }

  if (hasDMYSignal) {
    return {
      convention: DATE_CONVENTIONS.DMY,
      status: 'inferred',
      stableCause: 'An unambiguous D/M/Y date appears in the chat.',
      tokenSignals,
      validTokenCount,
    }
  }

  if (validTokenCount > 0) {
    return {
      convention: DATE_CONVENTIONS.DMY,
      status: 'fallback',
      stableCause: 'All recognized dates are ambiguous; D/M/Y fallback was used.',
      tokenSignals,
      validTokenCount,
    }
  }

  return {
    convention: null,
    status: 'unsupported',
    stableCause: 'No supported WhatsApp message lines were found.',
    tokenSignals,
    validTokenCount,
  }
}

export const createParserDiagnostic = input => {
  const lines = normalizeInput(input).split('\n')
  const tokens = tokenizeMessageStarts(input)
  const inference = inferDateConvention(tokens)

  return {
    lineCount: input ? lines.length : 0,
    candidateCount: tokens.length,
    recognizedCount: inference.validTokenCount,
    dateConvention: inference.convention?.id || null,
    conventionStatus: inference.status,
    stableCause: inference.stableCause,
  }
}

const unsupportedChatError = diagnostic => {
  const error = new Error(UNSUPPORTED_CHAT_ERROR)
  error.diagnostic = diagnostic
  return error
}

export const parseMessages = input => {
  const normalizedInput = normalizeInput(input)
  const lines = normalizedInput.split('\n')
  const tokens = tokenizeMessageStarts(normalizedInput)
  const inference = inferDateConvention(tokens)
  const diagnostic = createParserDiagnostic(normalizedInput)

  if (!inference.convention || inference.status === 'conflict') {
    throw unsupportedChatError(diagnostic)
  }

  const tokenByLine = tokens.reduce((byLine, token, index) => {
    if (inference.tokenSignals[index] === 'invalid') {
      return byLine
    }

    byLine.set(token.lineIndex, token)
    return byLine
  }, new Map())

  const parsedMessages = []

  lines.forEach((line, lineIndex) => {
    const token = tokenByLine.get(lineIndex)

    if (token) {
      parsedMessages.push({
        id: parsedMessages.length,
        date: materializeDate(token, inference.convention),
        ...splitSenderAndMessage(token.content),
      })
      return
    }

    const currentMessage = parsedMessages[parsedMessages.length - 1]

    if (currentMessage) {
      currentMessage.message = `${currentMessage.message}\n${line}`
    }
  })

  if (parsedMessages.length === 0) {
    throw unsupportedChatError(diagnostic)
  }

  return parsedMessages
}

export const parseContacts = messages => {
  const uniqContacts = new Set()

  messages.forEach(message => {
    if (message.type !== 'chat') return
    if (uniqContacts.has(message.sender)) return

    uniqContacts.add(message.sender)
  })

  return Array.from(uniqContacts)
}
