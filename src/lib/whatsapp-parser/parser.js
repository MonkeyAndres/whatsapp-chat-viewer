import * as R from 'ramda'
import {
  DATE_SEPARATOR,
  TIME_SEPARATOR,
  SECURITY_MESSAGE_REGEXP,
  WHATSAPP_MESSAGE_REGEXP
} from './constants'

const getDateByStrings = (dateString, timeString) => {
  const [day, month, year] = dateString.split(DATE_SEPARATOR)
  const [hours, minutes, seconds] = timeString.split(TIME_SEPARATOR)

  // The month must be between 0 and 11
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds))
  return date
}

const checkIsValidInput = R.pipe(
  R.split('\n'),
  R.nth(0),
  R.match(SECURITY_MESSAGE_REGEXP),
  R.complement(R.isEmpty)
)

export const parseMessages = input => {
  const isValidChat = checkIsValidInput(input)

  if (!isValidChat) {
    throw new Error('We cannot read whatsapp chat')
  }

  const messages = input.match(new RegExp(WHATSAPP_MESSAGE_REGEXP, 'g'))

  const parsedMessages = messages.map(msg => {
    const [, date, hour, sender, message] = msg.match(WHATSAPP_MESSAGE_REGEXP)
    return { date: getDateByStrings(date, hour), sender, message }
  })

  return parsedMessages
}

export const parseContacts = R.pipe(
  R.map(R.prop('sender')),
  R.filter(R.pipe(R.isEmpty, R.not)),
  R.uniq
)
