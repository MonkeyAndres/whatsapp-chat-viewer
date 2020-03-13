import * as R from 'ramda'
import { parseMessages, parseContacts } from './parser'

const parseWhatsappChat = input => {
  const messages = parseMessages(input)
  const contacts = parseContacts(messages)

  if (R.isEmpty(messages) || R.isEmpty(contacts)) {
    throw new Error('We cannot read whatsapp chat')
  }

  return { messages, contacts }
}

export default parseWhatsappChat
