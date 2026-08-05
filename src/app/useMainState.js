import { useEffect, useReducer, useCallback } from 'react'
import readBrowserFileContent from '../lib/readBrowserFileContent'
import parseWhatsappChat from '../lib/whatsapp-parser'
import {
  createFormatDiagnostic,
  createReadDiagnostic,
} from './fileDiagnostics'

const initialState = {
  chat: null,
  selectedContact: null,
  error: null,
  loading: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'startLoading': {
      return { ...state, loading: true }
    }

    case 'setChat': {
      return {
        ...state,
        chat: action.payload,
        loading: false,
        error: null,
      }
    }

    case 'setLoadError': {
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    }

    case 'selectContact': {
      return {
        ...state,
        selectedContact: action.payload,
      }
    }

    default: {
      throw new Error()
    }
  }
}

const useMainState = (selectedFile) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    ;(async function () {
      let data = null

      try {
        if (!selectedFile) return

        dispatch({ type: 'startLoading' })

        data = await readBrowserFileContent(selectedFile)
        const chat = parseWhatsappChat(data)

        dispatch({ type: 'setChat', payload: chat })
      } catch (error) {
        const diagnostic =
          typeof data === 'string'
            ? {
                ...createFormatDiagnostic({ file: selectedFile, content: data }),
                parser: error.diagnostic || null,
                stableCause:
                  error.diagnostic?.stableCause ||
                  'No supported WhatsApp message lines were found.',
              }
            : createReadDiagnostic({ file: selectedFile })

        dispatch({
          type: 'setLoadError',
          payload: {
            error,
            diagnostic,
          },
        })
      }
    })()
  }, [selectedFile])

  const setSelectedContact = useCallback((contact) => {
    dispatch({ type: 'selectContact', payload: contact })
  }, [])

  return { ...state, setSelectedContact }
}

export default useMainState
