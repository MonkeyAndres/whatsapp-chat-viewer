import React from 'react'
import { useI18n } from '../../app/i18n'

const AboutApp = () => {
  const { t } = useI18n()

  return (
    <div className="aboutApp">
      <h1 className="welcome-title">
        {t('about.title').split('\n').map((line, index) => (
          <React.Fragment key={line}>
            {index > 0 && <br />}
            {line}
          </React.Fragment>
        ))}
      </h1>

      <p>{t('about.description')}</p>

      <p>{t('about.requirement')}</p>

      <h2 className="aboutApp-subheader">{t('about.exportTitle')}</h2>
      <p>{t('about.exportHelp')}</p>
      <p>
        <a href="https://faq.whatsapp.com/en/android/23756533/">
          {t('about.android')}
        </a>
      </p>
      <p>
        <a href="https://faq.whatsapp.com/en/iphone/26000285/?category=5245251">
          {t('about.iphone')}
        </a>
      </p>

      <h2 className="aboutApp-subheader">{t('about.projectTitle')}</h2>
      <p>
        {t('about.projectPrefix')}
        <a href="https://github.com/MonkeyAndres">@MonkeyAndres</a>
        {t('about.projectMiddle')}
        <a href="https://github.com/MonkeyAndres/whatsapp-chat-viewer">
          {t('about.projectLink')}
        </a>
      </p>

      <br />
    </div>
  )
}

export default AboutApp
