import React from 'react'
import { ReactComponent as BackArrow } from '../../assets/icons/arrow-left.svg'
import { useI18n } from '../../app/i18n'

const ContactSelector = ({ contacts, onSelectContact, goBack }) => {
  const { t } = useI18n()

  return (
    <div className="contactSelector">
      <div className="contactSelector-header">
        <BackArrow
          aria-label={t('contact.back')}
          className="back-arrow"
          onClick={goBack}
          role="button"
        />
        <h3 className="text">{t('contact.title')}</h3>
      </div>

      <div className="contactSelector-contactList">
        {contacts.map((contact) => (
          <button
            className="contactSelector-contact"
            key={contact}
            onClick={() => onSelectContact(contact)}
          >
            {contact}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ContactSelector
