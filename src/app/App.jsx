import React, { useState, useCallback } from 'react'
import Layout from '../ui/shared/Layout'
import WelcomeView from '../ui/welcome/WelcomeView'
import { CSSTransition } from 'react-transition-group'
import Main from './Main'

const App = () => {
  const [selectedFile, setSelectedFile] = useState()

  const onSelectFile = useCallback(file => {
    setSelectedFile(file)
  }, [])

  const goBack = useCallback(() => setSelectedFile(null), [])

  return (
    <Layout>
      <CSSTransition
        appear={!selectedFile}
        in={!selectedFile}
        timeout={{
          enter: 600,
          exit: 200
        }}
        classNames="card"
        mountOnEnter
        unmountOnExit
      >
        <WelcomeView onSelectFile={onSelectFile} />
      </CSSTransition>

      <CSSTransition
        appear={!!selectedFile}
        in={!!selectedFile}
        timeout={{
          enter: 600,
          exit: 200
        }}
        classNames="card"
        mountOnEnter
        unmountOnExit
      >
        <Main goBack={goBack} selectedFile={selectedFile} />
      </CSSTransition>
    </Layout>
  )
}

export default App
