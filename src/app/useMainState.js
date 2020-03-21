import { useEffect, useReducer, useCallback } from 'react'
import readBrowserFileContent from '../lib/readBrowserFileContent'
import parseWhatsappChat from '../lib/whatsapp-parser'

const initialState = {
  chat: null,
  selectedContact: null,
  error: null,
  loading: true
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'setChat': {
      return {
        ...state,
        chat: action.payload,
        loading: false
      }
    }

    case 'setLoadError': {
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    }

    case 'selectContact': {
      return {
        ...state,
        selectedContact: action.payload
      }
    }

    default: {
      throw new Error()
    }
  }
}

const useMainState = selectedFile => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    ;(async function() {
      try {
        if (!selectedFile) return

        const data = await readBrowserFileContent(selectedFile)
        const chat = parseWhatsappChat(data)

        dispatch({ type: 'setChat', payload: chat })
      } catch (error) {
        dispatch({ type: 'setLoadError', payload: error })
      }
    })()
  }, [selectedFile])

  const setSelectedContact = useCallback(contact => {
    dispatch({ type: 'selectContact', payload: contact })
  }, [])

  return { ...state, setSelectedContact }
}

export default useMainState
