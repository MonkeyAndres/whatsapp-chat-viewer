import React, { useRef } from 'react'
import { ReactComponent as UploadIcon } from '../../assets/icons/upload.svg'

const SimpleFileInput = ({ onSelectFile }) => {
  const fileInputRef = useRef()

  return (
    <div className="selectFile" onClick={() => fileInputRef.current.click()}>
      <UploadIcon className="selectFile-icon" />

      <h2 className="selectFile-label" htmlFor="chat">
        Choose a file!
      </h2>

      <input
        type="file"
        name="chat"
        id="chat"
        hidden
        ref={fileInputRef}
        onChange={(event) => onSelectFile(event.target.files[0])}
      />
    </div>
  )
}

export default SimpleFileInput
