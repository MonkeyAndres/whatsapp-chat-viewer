import React from 'react'
import { ReactComponent as BackArrow } from '../../assets/icons/arrow-left.svg'
import { CHAT_READ_MODES } from '../../app/chatReadModes'
import { useI18n } from '../../app/i18n'

const ChatView = ({
  header,
  goBack,
  readMode,
  onReadModeChange,
  chatSlot,
}) => {
  const { t } = useI18n()

  return (
    <div className="chatView">
      <div className="chatView-header">
        <button
          aria-label={t('chat.back')}
          className="back-arrow"
          onClick={goBack}
          type="button"
        >
          <BackArrow aria-hidden="true" focusable="false" />
        </button>
        <h3 className="header-text" title={header}>{header}</h3>
        <div className="readModeSwitch" aria-label={t('chat.readMode')}>
          <button
            type="button"
            className="readModeSwitch-option"
            aria-pressed={readMode === CHAT_READ_MODES.beginning}
            onClick={() => onReadModeChange(CHAT_READ_MODES.beginning)}
          >
            {t('chat.fromBeginning')}
          </button>
          <button
            type="button"
            className="readModeSwitch-option"
            aria-pressed={readMode === CHAT_READ_MODES.latest}
            onClick={() => onReadModeChange(CHAT_READ_MODES.latest)}
          >
            {t('chat.latestMessages')}
          </button>
        </div>
      </div>

      <div className="chatView-container">{chatSlot}</div>
    </div>
  )
}

export default ChatView
