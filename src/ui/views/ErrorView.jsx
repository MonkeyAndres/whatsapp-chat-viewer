import React from 'react'
import { useI18n } from '../../app/i18n'

const ErrorView = ({ error, onClickTryAgain }) => {
  const { t, tDiagnosticCause, tDiagnosticFileLabel } = useI18n()
  const diagnostic = error?.diagnostic
  const isReadError = diagnostic?.kind === 'read'
  const title = isReadError
    ? t('error.readTitle')
    : t('error.unsupportedTitle')
  const description = isReadError
    ? t('error.readDescription')
    : t('error.unsupportedDescription')

  return (
    <div className="errorView">
      <h2 className="errorView-title">{title}</h2>
      <p className="errorView-description">{description}</p>
      {diagnostic && (
        <div className="errorView-diagnostic" aria-label={t('error.privateDiagnostic')}>
          <dl>
            <div>
              <dt>{t('error.file')}</dt>
              <dd>{tDiagnosticFileLabel(diagnostic.fileLabel)}</dd>
            </div>
            <div>
              <dt>{t('error.extension')}</dt>
              <dd>{diagnostic.extension}</dd>
            </div>
            <div>
              <dt>{t('error.type')}</dt>
              <dd>{diagnostic.fileType}</dd>
            </div>
            <div>
              <dt>{t('error.size')}</dt>
              <dd>{diagnostic.size}</dd>
            </div>
            {diagnostic.lineCount !== null && (
              <div>
                <dt>{t('error.linesChecked')}</dt>
                <dd>{diagnostic.lineCount}</dd>
              </div>
            )}
            <div>
              <dt>{t('error.cause')}</dt>
              <dd>{tDiagnosticCause(diagnostic.stableCause)}</dd>
            </div>
            {diagnostic.parser && (
              <>
                <div>
                  <dt>{t('error.candidateLines')}</dt>
                  <dd>{diagnostic.parser.candidateCount}</dd>
                </div>
                <div>
                  <dt>{t('error.recognizedLines')}</dt>
                  <dd>{diagnostic.parser.recognizedCount}</dd>
                </div>
                <div>
                  <dt>{t('error.dateOrder')}</dt>
                  <dd>{diagnostic.parser.dateConvention || t('error.none')}</dd>
                </div>
              </>
            )}
          </dl>
          <p>
            {t('error.recognizedFormats')}
            {diagnostic.recognizedFormats.join(` ${t('error.or')} `)}.
          </p>
        </div>
      )}
      <button className="errorView-button" onClick={onClickTryAgain}>
        {t('error.chooseAnotherFile')}
      </button>
    </div>
  )
}

export default ErrorView
