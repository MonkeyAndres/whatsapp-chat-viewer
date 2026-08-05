import React from 'react'
import { ReactComponent as BackArrow } from '../../assets/icons/arrow-left.svg'
import { useI18n } from '../../app/i18n'

const ChatView = ({ header, goBack, chatSlot }) => {
  const { t } = useI18n()

  return (
    <div className="chatView">
      <div className="chatView-header">
        <BackArrow
          aria-label={t('chat.back')}
          className="back-arrow"
          onClick={goBack}
          role="button"
        />
        <h3 className="header-text" title={header}>{header}</h3>
      </div>

      <div className="chatView-container">{chatSlot}</div>
    </div>
  )
}

export default ChatView
