import React from 'react'

const ContactSelector = ({ contacts, onSelectContact }) => {
  return (
    <div className="contact-selector">
      <h1 className="who-are-you">Select who you are.</h1>
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
