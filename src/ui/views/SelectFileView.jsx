import React from 'react'
import DropFile from '../forms/DropFile'
import SimpleFileInput from '../forms/SimpleFileInput'

// Read more: https://css-tricks.com/drag-and-drop-file-uploading/
const isAdvancedUpload = (function () {
  var div = document.createElement('div')
  return 'draggable' in div || ('ondragstart' in div && 'ondrop' in div)
})()

const SelectFileView = ({ onSelectFile }) => {
  return (
    <div className="selectFileView">
      {isAdvancedUpload ? (
        <DropFile onSelectFile={onSelectFile} />
      ) : (
        <SimpleFileInput onSelectFile={onSelectFile} />
      )}
    </div>
  )
}

export default SelectFileView
