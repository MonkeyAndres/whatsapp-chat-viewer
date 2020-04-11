import React, { useState, useCallback } from 'react'
import Layout from '../ui/shared/Layout'
import AboutApp from '../ui/views/AboutApp'
import SelectFileView from '../ui/views/SelectFileView'
import useMainState from './useMainState'
import { isNilOrEmpty } from './utils'
import SpinnerView from '../ui/views/SpinnerView'
import ErrorView from '../ui/views/ErrorView'
import ContactSelector from '../ui/chat/ContactSelector'
import Chat from './Chat'
import useWindowDimensions from './useWindowDimensions'

const App = () => {
  const [selectedFile, setSelectedFile] = useState()

  const {
    chat,
    loading,
    error,
    selectedContact,
    setSelectedContact,
  } = useMainState(selectedFile)

  const hasFile = !isNilOrEmpty(selectedFile)
  const hasSelectedContact = !isNilOrEmpty(selectedContact)

  const goBack = useCallback(() => {
    setSelectedFile(null)
    setSelectedContact(null)
  }, [setSelectedContact])

  const { width } = useWindowDimensions()

  const isReducedView = width <= 768

  return (
    <Layout>
      {(!hasFile || !isReducedView) && <AboutApp />}

      <div className="chatContainer">
        {!hasFile ? (
          <SelectFileView onSelectFile={setSelectedFile} />
        ) : loading ? (
          <SpinnerView />
        ) : !isNilOrEmpty(error) ? (
          <ErrorView error={error} onClickTryAgain={goBack} />
        ) : !hasSelectedContact ? (
          <ContactSelector
            contacts={chat?.contacts || []}
            onSelectContact={setSelectedContact}
            goBack={goBack}
          />
        ) : (
          <Chat chat={chat} selectedContact={selectedContact} goBack={goBack} />
        )}
      </div>

      {/* <Main goBack={goBack} selectedFile={selectedFile} /> */}
    </Layout>
  )
}

export default App
