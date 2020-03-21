import React from 'react'

const ErrorMessage = ({ error, goBack }) => {
  return (
    <div className="card error">
      <h2 className="error-title">Error loading WhatsApp Chat</h2>
      <p className="error-description">{error?.message}</p>
      <button className="back-button" onClick={goBack}>
        Try again
      </button>
    </div>
  )
}

export default ErrorMessage
