import React, { useRef } from 'react'
import { ReactComponent as UploadIcon } from '../../assets/icons/upload.svg'

const SimpleFileInput = ({ onSelectFile }) => {
  const fileInputRef = useRef()

  return (
    <div className="drop-file" onClick={() => fileInputRef.current.click()}>
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

export default SimpleFileInput
