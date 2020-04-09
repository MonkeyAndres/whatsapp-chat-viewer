import { useEffect } from 'react'

const useDroppedFile = (dropFileRef, setSelectedFile) => {
  useEffect(() => {
    const dropFileElement = dropFileRef.current

    const getDroppedFile = event => {
      event.preventDefault()
      setSelectedFile(event.dataTransfer.files[0])
    }

    dropFileElement.addEventListener('drop', getDroppedFile)

    return () => dropFileElement.removeEventListener('drop', getDroppedFile)
  }, [dropFileRef, setSelectedFile])
}

export default useDroppedFile
