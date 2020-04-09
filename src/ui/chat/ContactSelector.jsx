import React from 'react'
import { ReactComponent as BackArrow } from '../../assets/icons/arrow-left.svg'

const ContactSelector = ({ contacts, onSelectContact, goBack }) => {
  return (
    <div className="contactSelector">
      <div className="contactSelector-header">
        <BackArrow className="back-arrow" onClick={goBack} />
        <h3 className="text">Select who you are.</h3>
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
