import {
  DATE_SEPARATOR,
  TIME_SEPARATOR,
  // SECURITY_MESSAGE_REGEXP,
  WHATSAPP_MESSAGE_REGEXP
} from './constants'

const getDateByStrings = (dateString, timeString) => {
  const [day, month, year] = dateString.split(DATE_SEPARATOR)
  const [hours, minutes, seconds] = timeString.split(TIME_SEPARATOR)

  // The month must be between 0 and 11
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds))
  return date
}

// const checkIsValidInput = R.pipe(
//   R.split('\n'),
//   R.nth(0),
//   R.match(SECURITY_MESSAGE_REGEXP),
//   R.complement(R.isEmpty)
// )

export const parseMessages = input => {
  /** HOTFIX! Comment security message check.
  const isValidChat = checkIsValidInput(input)

  if (!isValidChat) {
    throw new Error('We cannot read whatsapp chat')
  }
  */

  const messages = input.match(new RegExp(WHATSAPP_MESSAGE_REGEXP, 'g'))

  if(!messages) {
    throw new Error('We cannot read WhatsApp chat')
  }

  const parsedMessages = messages.map((msg, index) => {
    const [, date, hour, sender, message] = msg.match(WHATSAPP_MESSAGE_REGEXP)
    return { id: index, date: getDateByStrings(date, hour), sender, message }
  })

  return parsedMessages
}

export const parseContacts = (messages) => {
  const uniqContacts = new Set()

  messages.forEach((msg) => {
    if(uniqContacts.has(msg.sender)) return

    uniqContacts.add(msg.sender)
  })

  return Array.from(uniqContacts)
}