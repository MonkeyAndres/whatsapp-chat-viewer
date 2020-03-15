import React, { useState, useCallback } from 'react'
import Layout from '../ui/shared/Layout'
import WelcomeView from '../ui/welcome/WelcomeView'
import Main from './Main'
import TransitionWrapper from './common/TransitionWrapper'

const App = () => {
  const [selectedFile, setSelectedFile] = useState()

  const onSelectFile = useCallback(file => {
    setSelectedFile(file)
  }, [])

  const goBack = useCallback(() => setSelectedFile(null), [])

  return (
    <Layout>
      <TransitionWrapper appear={!selectedFile} animationType="from-left">
        <WelcomeView onSelectFile={onSelectFile} />
      </TransitionWrapper>

      <TransitionWrapper appear={!!selectedFile} animationType="from-right">
        <Main goBack={goBack} selectedFile={selectedFile} />
      </TransitionWrapper>
    </Layout>
  )
}

export default App
