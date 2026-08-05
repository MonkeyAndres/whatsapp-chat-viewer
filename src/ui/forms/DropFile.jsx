import React, { useRef } from 'react'
import useDragoverBehaviour from './useDragoverBehaviour'
import useDroppedFile from './useDroppedFile'
import { ReactComponent as UploadIcon } from '../../assets/icons/upload.svg'
import { useI18n } from '../../app/i18n'

const DropFile = ({ onSelectFile }) => {
  const dropFileRef = useRef()
  const fileInputRef = useRef()
  const { t } = useI18n()

  useDroppedFile(dropFileRef, onSelectFile)
  useDragoverBehaviour(dropFileRef)

  return (
    <div
      className="selectFile selectFile--advance"
      ref={dropFileRef}
      onClick={() => fileInputRef.current.click()}
    >
      <UploadIcon className="selectFile-icon" />

      <h2 className="selectFile-label" htmlFor="chat">
        {t('file.chooseOrDrop')}
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

export default DropFile
