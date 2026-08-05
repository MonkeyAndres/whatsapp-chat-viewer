import React from 'react'

const ErrorView = ({ error, onClickTryAgain }) => {
  const diagnostic = error?.diagnostic
  const isReadError = diagnostic?.kind === 'read'
  const title = isReadError
    ? 'We could not read this file.'
    : 'This does not look like a supported WhatsApp chat.'
  const description = isReadError
    ? 'Choose the exported .txt file again, or export a fresh copy without media.'
    : 'No supported WhatsApp message lines were found. Choose a WhatsApp .txt export without media.'

  return (
    <div className="errorView">
      <h2 className="errorView-title">{title}</h2>
      <p className="errorView-description">{description}</p>
      {diagnostic && (
        <div className="errorView-diagnostic" aria-label="Private diagnostic">
          <dl>
            <div>
              <dt>File</dt>
              <dd>{diagnostic.fileLabel}</dd>
            </div>
            <div>
              <dt>Extension</dt>
              <dd>{diagnostic.extension}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{diagnostic.fileType}</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>{diagnostic.size}</dd>
            </div>
            {diagnostic.lineCount !== null && (
              <div>
                <dt>Lines checked</dt>
                <dd>{diagnostic.lineCount}</dd>
              </div>
            )}
            <div>
              <dt>Cause</dt>
              <dd>{diagnostic.stableCause}</dd>
            </div>
            {diagnostic.parser && (
              <>
                <div>
                  <dt>Candidate lines</dt>
                  <dd>{diagnostic.parser.candidateCount}</dd>
                </div>
                <div>
                  <dt>Recognized lines</dt>
                  <dd>{diagnostic.parser.recognizedCount}</dd>
                </div>
                <div>
                  <dt>Date order</dt>
                  <dd>{diagnostic.parser.dateConvention || 'none'}</dd>
                </div>
              </>
            )}
          </dl>
          <p>
            Recognized lines look like{' '}
            {diagnostic.recognizedFormats.join(' or ')}.
          </p>
        </div>
      )}
      <button className="errorView-button" onClick={onClickTryAgain}>
        Choose another file
      </button>
    </div>
  )
}

export default ErrorView
