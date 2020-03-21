import React from 'react'
import ContactSelector from '../ui/main/ContactSelector'
import { isNilOrEmpty } from './utils'
import Chat from './Chat'
import useMainState from './useMainState'
import ErrorMessage from '../ui/main/ErrorMessage'

const Main = ({ selectedFile, goBack }) => {
  const {
    chat,
    loading,
    error,
    selectedContact,
    setSelectedContact
  } = useMainState(selectedFile)

  const hasError = !isNilOrEmpty(error) && !loading
  const hasSelectedContact = !isNilOrEmpty(selectedContact)

  return (
    <>
      {hasError && <ErrorMessage error={error} goBack={goBack} />}

      {!hasSelectedContact && !hasError && (
        <ContactSelector
          contacts={chat?.contacts || []}
          onSelectContact={setSelectedContact}
          goBack={goBack}
        />
      )}

      {hasSelectedContact && (
        <Chat chat={chat} selectedContact={selectedContact} goBack={goBack} />
      )}
    </>
  )
}

export default Main
