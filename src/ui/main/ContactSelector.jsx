import React from 'react'
import { ReactComponent as BackArrow } from '../../assets/icons/arrow-left.svg'

const ContactSelector = ({ contacts, onSelectContact, goBack }) => {
  return (
    <div className="card contact-selector">
      <div className="who-are-you">
        <BackArrow className="back-arrow" onClick={goBack} />
        <span className="text">Select who you are.</span>
      </div>

      {contacts.map(contact => (
        <button
          className="contact"
          key={contact}
          onClick={() => onSelectContact(contact)}
        >
          {contact}
        </button>
      ))}
    </div>
  )
}

export default ContactSelector
