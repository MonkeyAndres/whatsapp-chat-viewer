import React, { useState, useCallback } from 'react'
import WelcomeView from '../ui/welcome/WelcomeView'

const Welcome = () => {
  const [selectedFile, setSelectedFile] = useState()

  const onSelectFile = useCallback(file => {
    setSelectedFile(file)
  }, [])

  return selectedFile ? (
    <p>Loading...</p>
  ) : (
    <WelcomeView onSelectFile={onSelectFile} />
  )
}

export default Welcome
