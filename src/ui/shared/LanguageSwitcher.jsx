import React from 'react'
import { LANGUAGES, useI18n } from '../../app/i18n'

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useI18n()

  return (
    <div className="languageSwitcher" aria-label={t('language.label')} role="group">
      <button
        aria-pressed={language === LANGUAGES.es}
        className="languageSwitcher-option"
        onClick={() => setLanguage(LANGUAGES.es)}
        type="button"
      >
        ES
      </button>
      <button
        aria-pressed={language === LANGUAGES.en}
        className="languageSwitcher-option"
        onClick={() => setLanguage(LANGUAGES.en)}
        type="button"
      >
        EN
      </button>
    </div>
  )
}

export default LanguageSwitcher
