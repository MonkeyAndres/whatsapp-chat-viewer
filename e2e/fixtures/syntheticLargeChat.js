const CONTACTS = [
  'Alice Synthetic',
  'Bob Synthetic',
  'Carla Synthetic',
  'Diego Synthetic',
]

const buildMessageText = index => {
  if (index % 257 === 0) {
    return [
      `Synthetic multiline note ${index}`,
      'Second line with a deterministic wrap check.',
      'Third line keeps browser rendering realistic.',
    ].join('\n')
  }

  if (index % 149 === 0) {
    return `Short ${index}`
  }

  return `Synthetic message ${index} with enough plain text to exercise wrapping in a large chat.`
}

const buildSyntheticLargeChat = (messageCount = 10020) => {
  const lines = [
    '12/31/23, 8:00 AM - Messages and calls are end-to-end encrypted.',
  ]

  for (let index = 0; index < messageCount; index += 1) {
    const day = 1 + (index % 28)
    const hour = 1 + (index % 12)
    const minute = String(index % 60).padStart(2, '0')

    if (index > 0 && index % 211 === 0) {
      lines.push(`1/${day}/24, ${hour}:${minute} AM - Synthetic system notice ${index}`)
      continue
    }

    const sender = CONTACTS[index % CONTACTS.length]
    lines.push(`1/${day}/24, ${hour}:${minute} AM - ${sender}: ${buildMessageText(index)}`)
  }

  return `${lines.join('\n')}\n`
}

module.exports = {
  CONTACTS,
  buildSyntheticLargeChat,
}
