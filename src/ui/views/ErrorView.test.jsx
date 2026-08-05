import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import ErrorView from './ErrorView'
import {
  createFormatDiagnostic,
  createReadDiagnostic,
} from '../../app/fileDiagnostics'
import { I18nProvider, LANGUAGE_STORAGE_KEY } from '../../app/i18n'

describe('ErrorView', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test('shows a private unsupported-format diagnostic and retry action', () => {
    const onClickTryAgain = jest.fn()
    const { getByText, getByLabelText, queryByText } = render(
      <ErrorView
        error={{
          diagnostic: createFormatDiagnostic({
            file: {
              name: 'Alice phone export.txt',
              type: 'text/plain',
              size: 2048,
            },
            content: 'Alice: secret\n+15551234567',
          }),
        }}
        onClickTryAgain={onClickTryAgain}
      />
    )

    expect(
      getByText('This does not look like a supported WhatsApp chat.')
    ).toBeInTheDocument()
    expect(getByLabelText('Private diagnostic')).toHaveTextContent(
      'No supported WhatsApp message lines were found.'
    )
    expect(getByLabelText('Private diagnostic')).toHaveTextContent('.txt')
    expect(getByLabelText('Private diagnostic')).toHaveTextContent('2 KB')
    expect(queryByText(/Alice/)).not.toBeInTheDocument()
    expect(queryByText(/\+15551234567/)).not.toBeInTheDocument()

    fireEvent.click(getByText('Choose another file'))

    expect(onClickTryAgain).toHaveBeenCalledTimes(1)
  })

  test('distinguishes browser read failures from unsupported chat format', () => {
    const { getByText } = render(
      <ErrorView
        error={{
          diagnostic: createReadDiagnostic({
            file: {
              name: 'chat.txt',
              type: '',
              size: 0,
            },
          }),
        }}
        onClickTryAgain={() => {}}
      />
    )

    expect(getByText('We could not read this file.')).toBeInTheDocument()
    expect(
      getByText('The browser could not read the selected file.')
    ).toBeInTheDocument()
  })

  test('shows critical unsupported-format text in Spanish', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es')

    const { getByLabelText, getByText } = render(
      <I18nProvider>
        <ErrorView
          error={{
            diagnostic: createFormatDiagnostic({
              file: {
                name: 'chat.txt',
                type: 'text/plain',
                size: 120,
              },
              content: 'not a supported export',
            }),
          }}
          onClickTryAgain={() => {}}
        />
      </I18nProvider>
    )

    expect(
      getByText('Esto no parece un chat de WhatsApp compatible.')
    ).toBeInTheDocument()
    expect(getByLabelText('Diagnostico privado')).toHaveTextContent(
      'No se encontraron lineas de mensajes de WhatsApp compatibles.'
    )
    expect(getByText('Elige otro archivo')).toBeInTheDocument()
  })


  test('shows parser counts without exposing chat content', () => {
    const { getByLabelText, queryByText } = render(
      <ErrorView
        error={{
          diagnostic: {
            ...createFormatDiagnostic({
              file: {
                name: 'private-chat.txt',
                type: 'text/plain',
                size: 120,
              },
              content: '5/16/16, 7:49 PM - Alice Example: synthetic secret',
            }),
            stableCause: 'Conflicting day/month evidence was found across the chat.',
            parser: {
              lineCount: 2,
              candidateCount: 2,
              recognizedCount: 2,
              dateConvention: null,
              conventionStatus: 'conflict',
              stableCause: 'Conflicting day/month evidence was found across the chat.',
            },
          },
        }}
        onClickTryAgain={() => {}}
      />
    )

    const diagnostic = getByLabelText('Private diagnostic')

    expect(diagnostic).toHaveTextContent('Candidate lines')
    expect(diagnostic).toHaveTextContent('Recognized lines')
    expect(diagnostic).toHaveTextContent('Date order')
    expect(diagnostic).toHaveTextContent('none')
    expect(queryByText(/synthetic secret/)).not.toBeInTheDocument()
    expect(queryByText(/Alice Example/)).not.toBeInTheDocument()
  })
})
