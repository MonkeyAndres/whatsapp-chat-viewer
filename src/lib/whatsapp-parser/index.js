import { parseMessages, parseContacts } from './parser'

const parseWhatsappChat = input => {
  const messages = parseMessages(input)
  const contacts = parseContacts(messages)

  return { messages, contacts }
}

export default parseWhatsappChat
