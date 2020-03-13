import * as R from 'ramda'
import {
  DATE_START_INDEX,
  DATE_END_INDEX,
  DATE_SEPARATOR,
  TIME_START_INDEX,
  TIME_END_INDEX,
  TIME_SEPARATOR,
  SENDER_START_INDEX,
  SENDER_END_INDICATOR,
  SECURITY_MESSAGE_REGEXP
} from './constants'

const extractDate = item => {
  const [day, month, year] = item
    .substring(DATE_START_INDEX, DATE_END_INDEX)
    .split(DATE_SEPARATOR)

  const [hours, minutes, seconds] = item
    .substring(TIME_START_INDEX, TIME_END_INDEX)
    .split(TIME_SEPARATOR)

  // The month must be between 0 and 11
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds))
  return { date }
}

const extractSender = item => {
  const END_SENDER_INDEX = item.indexOf(
    SENDER_END_INDICATOR,
    SENDER_START_INDEX
  )

  const sender = item.substring(SENDER_START_INDEX, END_SENDER_INDEX).trim()
  return { sender }
}

const extractMessage = item => {
  const END_SENDER_INDEX = item.indexOf(
    SENDER_END_INDICATOR,
    SENDER_START_INDEX
  )

  const message = item.substring(END_SENDER_INDEX + 2).replace('\r', '')
  return { message }
}

export const parseMessages = R.pipe(
  R.split('\n'),
  R.ifElse(
    R.pipe(R.nth(0), R.match(SECURITY_MESSAGE_REGEXP), R.complement(R.isEmpty)),
    R.drop(1), // Drop security message
    R.always([])
  ),
  R.map(
    R.converge((...args) => R.mergeAll(args), [
      extractDate,
      extractSender,
      extractMessage
    ])
  )
)

export const parseContacts = R.pipe(
  R.map(R.prop('sender')),
  R.filter(R.pipe(R.isEmpty, R.not)),
  R.uniq
)
