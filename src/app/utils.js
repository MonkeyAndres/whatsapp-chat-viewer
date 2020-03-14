import * as R from 'ramda'

export const isNilOrEmpty = R.anyPass([R.isNil, R.isEmpty])

export const dateToLocateTimeString = date =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
