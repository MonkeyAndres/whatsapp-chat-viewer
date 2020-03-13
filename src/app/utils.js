import * as R from 'ramda'

export const isNilOrEmpty = R.anyPass([R.isNil, R.isEmpty])
