import { parseMessages, parseContacts } from './parser'

const parseWhatsappChat = input => {
  const parsedMessages = parseMessages(input)
  const contacts = parseContacts(parsedMessages)

  const header = 'WhatsApp Chat'

  return { header, messages: parsedMessages, contacts }
}

export default parseWhatsappChat
