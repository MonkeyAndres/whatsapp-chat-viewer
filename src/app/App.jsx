import React, { useState, useCallback } from 'react'
import Layout from '../ui/shared/Layout'
import WelcomeView from '../ui/welcome/WelcomeView'
import { CSSTransition } from 'react-transition-group'

const App = () => {
  const [selectedFile, setSelectedFile] = useState()

  const onSelectFile = useCallback(file => {
    setSelectedFile(file)
  }, [])

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
        in={!!selectedFile}
        timeout={{
          enter: 600,
          exit: 200
        }}
        classNames="card"
        mountOnEnter
        unmountOnExit
      >
        <div className="card">
          <p>Another Screen</p>
          <button onClick={() => setSelectedFile(null)}>Go back</button>
        </div>
      </CSSTransition>
    </Layout>
  )
}

export default App
