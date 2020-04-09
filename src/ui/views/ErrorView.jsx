import React from 'react'

const ErrorView = ({ error, onClickTryAgain }) => {
  return (
    <div className="errorView">
      <h2 className="errorView-title">Error loading WhatsApp Chat</h2>
      <p className="errorView-description">{error?.message}</p>
      <button className="errorView-button" onClick={onClickTryAgain}>
        Try again
      </button>
    </div>
  )
}

export default ErrorView
