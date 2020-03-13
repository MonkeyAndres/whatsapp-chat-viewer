import React, { useState, useEffect } from 'react'
import readBrowserFileContent from '../lib/readBrowserFileContent'
import parseWhatsappChat from '../lib/whatsapp-parser'
import ContactSelector from '../ui/main/ContactSelector'
import { isNilOrEmpty } from './utils'

const Main = ({ goBack, selectedFile }) => {
  const [chat, setChat] = useState()
  const [selectedContact, setSelectedContact] = useState()

  useEffect(() => {
    ;(async function() {
      try {
        const data = await readBrowserFileContent(selectedFile)
        const chat = parseWhatsappChat(data)

        setChat(chat)

        console.log(chat)
      } catch (error) {
        console.log({ error })
        goBack()
      }
    })()
  }, [goBack, selectedFile])

  return (
    <div className="card main">
      {isNilOrEmpty(chat) && <p>Loading...</p>}

      {isNilOrEmpty(selectedContact) && !isNilOrEmpty(chat) && (
        <ContactSelector
          contacts={chat.contacts}
          onSelectContact={setSelectedContact}
        />
      )}

      {!isNilOrEmpty(selectedContact) && <p>Hello {selectedContact}</p>}
    </div>
  )
}

export default Main
