import { parseMessages, parseContacts } from './parser'

const parseWhatsappChat = input => {
  const parsedMessages = parseMessages(input)
  const hasHeader = parsedMessages[0]?.type === 'system'
  const messages = hasHeader ? parsedMessages.slice(1) : parsedMessages
  const contacts = parseContacts(messages)

  const header = hasHeader ? parsedMessages[0].message : 'WhatsApp Chat'

  return { header, messages, contacts }
}

export default parseWhatsappChat
