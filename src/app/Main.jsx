import React, { useState, useEffect } from 'react'
import readBrowserFileContent from '../lib/readBrowserFileContent'
import parseWhatsappChat from '../lib/whatsapp-parser'
import ContactSelector from '../ui/main/ContactSelector'
import { isNilOrEmpty } from './utils'
import Chat from './Chat'

const Main = ({ goBack, selectedFile }) => {
  const [chat, setChat] = useState()
  const [selectedContact, setSelectedContact] = useState()

  useEffect(() => {
    ;(async function() {
      try {
        if (!selectedFile) return

        const data = await readBrowserFileContent(selectedFile)
        const chat = parseWhatsappChat(data)

        setChat(chat)

        // Auto-select who are you based on chat header
        if (chat.contacts.length === 2) {
          const [contact] = chat.contacts.filter(
            contact => contact !== chat.header
          )
          setSelectedContact(contact)
        }

        console.log(chat)
      } catch (error) {
        console.log({ error })
        goBack()
      }
    })()
  }, [goBack, selectedFile])

  return (
    <>
      {isNilOrEmpty(chat) && (
        <div className="card">
          <p>Loading...</p>
        </div>
      )}

      {isNilOrEmpty(selectedContact) && !isNilOrEmpty(chat) && (
        <ContactSelector
          contacts={chat.contacts}
          onSelectContact={setSelectedContact}
        />
      )}

      {!isNilOrEmpty(selectedContact) && (
        <Chat chat={chat} selectedContact={selectedContact} goBack={goBack} />
      )}
    </>
  )
}

export default Main
