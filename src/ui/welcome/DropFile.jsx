import React, { useRef } from 'react'
import useDragoverBehaviour from './useDragoverBehaviour'
import useDroppedFile from './useDroppedFile'
import { ReactComponent as UploadIcon } from '../../assets/icons/upload.svg'

const DropFile = ({ onSelectFile }) => {
  const dropFileRef = useRef()
  const fileInputRef = useRef()

  useDroppedFile(dropFileRef, onSelectFile)
  useDragoverBehaviour(dropFileRef)

  return (
    <div
      className="drop-file"
      ref={dropFileRef}
      onClick={() => fileInputRef.current.click()}
    >
      <UploadIcon />

      <label htmlFor="chat">Choose a file or drag it here!</label>

      <input
        type="file"
        name="chat"
        id="chat"
        hidden
        ref={fileInputRef}
        onChange={event => onSelectFile(event.target.files[0])}
      />
    </div>
  )
}

export default DropFile
