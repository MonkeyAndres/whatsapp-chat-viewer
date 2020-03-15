import { parseMessages, parseContacts } from './parser'

const parseWhatsappChat = input => {
  const [securityMessage, ...messages] = parseMessages(input)
  const contacts = parseContacts(messages)

  const { sender: header } = securityMessage

  return { header, messages, contacts }
}

export default parseWhatsappChat
