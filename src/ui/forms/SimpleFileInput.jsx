import React, { useRef } from 'react'
import { ReactComponent as UploadIcon } from '../../assets/icons/upload.svg'
import { useI18n } from '../../app/i18n'

const SimpleFileInput = ({ onSelectFile }) => {
  const fileInputRef = useRef()
  const { t } = useI18n()

  return (
    <div className="selectFile" onClick={() => fileInputRef.current.click()}>
      <UploadIcon className="selectFile-icon" />

      <h2 className="selectFile-label" htmlFor="chat">
        {t('file.choose')}
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
