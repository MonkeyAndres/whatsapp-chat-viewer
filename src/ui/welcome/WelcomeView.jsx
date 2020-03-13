import React from 'react'
import DropFile from './DropFile'
import SimpleFileInput from './SimpleFileInput'

// Read more: https://css-tricks.com/drag-and-drop-file-uploading/
const isAdvancedUpload = (function() {
  var div = document.createElement('div')
  return 'draggable' in div || ('ondragstart' in div && 'ondrop' in div)
})()

const WelcomeView = ({ onSelectFile }) => {
  return (
    <>
      <div className="welcome-grid">
        <div className="back-header"></div>

        <div className="card">
          <h1 className="welcome-title">WhatsApp Chat Viewer</h1>
          <div className="paragraph-1">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum esse
            vel necessitatibus! Suscipit a aliquid ea natus dolores temporibus
            deserunt quod mollitia voluptates modi earum, odio eius explicabo
            asperiores adipisci?
          </div>

          {isAdvancedUpload ? (
            <DropFile onSelectFile={onSelectFile} />
          ) : (
            <SimpleFileInput onSelectFile={onSelectFile} />
          )}

          <div className="paragraph-2">
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Obcaecati repellat corporis incidunt itaque similique, nam quod
              illo esse amet sequi laboriosam est, dicta assumenda aliquid,
              inventore animi asperiores velit non?
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default WelcomeView
