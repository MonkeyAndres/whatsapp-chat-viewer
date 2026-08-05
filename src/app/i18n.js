import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export const LANGUAGE_STORAGE_KEY = 'whatsapp-chat-viewer-language'

export const LANGUAGES = {
  es: 'es',
  en: 'en',
}

const translations = {
  es: {
    'language.label': 'Idioma',
    'language.es': 'Castellano',
    'language.en': 'English',
    'about.title': 'Visor de chats\nde WhatsApp',
    'about.description':
      'WhatsApp Chat Viewer es una herramienta en línea para ver chats exportados de WhatsApp. La web no guarda datos de usuario: solo da formato a los mensajes para que sea más fácil leerlos.',
    'about.requirement':
      'Para usar esta herramienta necesitas un chat de WhatsApp exportado en formato .txt. Abajo puedes ver cómo exportarlo.',
    'about.exportTitle': 'Cómo exportar un chat de WhatsApp',
    'about.exportHelp':
      'Sigue la sección "Export chat history" de los tutoriales siguientes.',
    'about.android': 'Para dispositivos Android',
    'about.iphone': 'Para dispositivos iPhone',
    'about.projectTitle': 'Sobre este proyecto',
    'about.projectPrefix': 'Este es un proyecto personal desarrollado por ',
    'about.projectMiddle':
      '. Es completamente gratis y de código abierto. Puedes acceder al código fuente ',
    'about.projectLink': 'aquí.',
    'file.choose': 'Elige un archivo',
    'file.chooseOrDrop': 'Elige un archivo o arrástralo aquí',
    'contact.back': 'Volver',
    'contact.title': 'Selecciona quién eres.',
    'chat.back': 'Volver',
    'chat.readMode': 'Modo de lectura',
    'chat.fromBeginning': 'Desde el principio',
    'chat.latestMessages': 'Mensajes recientes',
    'error.unsupportedTitle':
      'Esto no parece un chat de WhatsApp compatible.',
    'error.unsupportedDescription':
      'No se encontraron líneas de mensajes de WhatsApp compatibles. Elige una exportación .txt de WhatsApp sin archivos multimedia.',
    'error.readTitle': 'No pudimos leer este archivo.',
    'error.readDescription':
      'Vuelve a elegir el archivo .txt exportado, o exporta una copia nueva sin archivos multimedia.',
    'error.privateDiagnostic': 'Diagnóstico privado',
    'error.file': 'Archivo',
    'error.extension': 'Extensión',
    'error.type': 'Tipo',
    'error.size': 'Tamaño',
    'error.linesChecked': 'Líneas revisadas',
    'error.cause': 'Causa',
    'error.candidateLines': 'Líneas candidatas',
    'error.recognizedLines': 'Líneas reconocidas',
    'error.dateOrder': 'Orden de fecha',
    'error.none': 'ninguno',
    'error.recognizedFormats': 'Las líneas reconocidas se parecen a ',
    'error.or': 'o',
    'error.chooseAnotherFile': 'Elige otro archivo',
    'diagnostic.fileLabel.selected': 'Archivo seleccionado',
    'diagnostic.cause.noLines':
      'No se encontraron líneas de mensajes de WhatsApp compatibles.',
    'diagnostic.cause.readFailure':
      'El navegador no pudo leer el archivo seleccionado.',
    'diagnostic.cause.conflict':
      'Se encontró evidencia contradictoria de día/mes en el chat.',
    'diagnostic.cause.mdy':
      'Aparece una fecha M/D/A no ambigua en el chat.',
    'diagnostic.cause.dmy':
      'Aparece una fecha D/M/A no ambigua en el chat.',
  },
  en: {
    'language.label': 'Language',
    'language.es': 'Castellano',
    'language.en': 'English',
    'about.title': 'WhatsApp\nChat viewer',
    'about.description':
      "WhatsApp Chat Viewer is an online tool that allows you to view your WhatsApp exported chats. The web doesn't store any user data: it only formats the chat messages in a more visual way to help users read exported chats.",
    'about.requirement':
      'To use this tool, you will need an exported WhatsApp chat in .txt format. Below, you can see how to export a WhatsApp chat.',
    'about.exportTitle': 'How to export a WhatsApp chat',
    'about.exportHelp':
      'Follow the "Export chat history" part of the tutorials below.',
    'about.android': 'For Android devices',
    'about.iphone': 'For iPhone devices',
    'about.projectTitle': 'About this project',
    'about.projectPrefix': 'This is a personal project developed by ',
    'about.projectMiddle':
      '. It is completely free and open source. You can access the source code ',
    'about.projectLink': 'here.',
    'file.choose': 'Choose a file',
    'file.chooseOrDrop': 'Choose a file or drag it here',
    'contact.back': 'Back',
    'contact.title': 'Select who you are.',
    'chat.back': 'Back',
    'chat.readMode': 'Reading mode',
    'chat.fromBeginning': 'From the beginning',
    'chat.latestMessages': 'Latest messages',
    'error.unsupportedTitle':
      'This does not look like a supported WhatsApp chat.',
    'error.unsupportedDescription':
      'No supported WhatsApp message lines were found. Choose a WhatsApp .txt export without media.',
    'error.readTitle': 'We could not read this file.',
    'error.readDescription':
      'Choose the exported .txt file again, or export a fresh copy without media.',
    'error.privateDiagnostic': 'Private diagnostic',
    'error.file': 'File',
    'error.extension': 'Extension',
    'error.type': 'Type',
    'error.size': 'Size',
    'error.linesChecked': 'Lines checked',
    'error.cause': 'Cause',
    'error.candidateLines': 'Candidate lines',
    'error.recognizedLines': 'Recognized lines',
    'error.dateOrder': 'Date order',
    'error.none': 'none',
    'error.recognizedFormats': 'Recognized lines look like ',
    'error.or': 'or',
    'error.chooseAnotherFile': 'Choose another file',
    'diagnostic.fileLabel.selected': 'Selected file',
    'diagnostic.cause.noLines':
      'No supported WhatsApp message lines were found.',
    'diagnostic.cause.readFailure':
      'The browser could not read the selected file.',
    'diagnostic.cause.conflict':
      'Conflicting day/month evidence was found across the chat.',
    'diagnostic.cause.mdy':
      'An unambiguous M/D/Y date appears in the chat.',
    'diagnostic.cause.dmy':
      'An unambiguous D/M/Y date appears in the chat.',
  },
}

const diagnosticCauseKeys = {
  'No supported WhatsApp message lines were found.': 'diagnostic.cause.noLines',
  'The browser could not read the selected file.':
    'diagnostic.cause.readFailure',
  'Conflicting day/month evidence was found across the chat.':
    'diagnostic.cause.conflict',
  'An unambiguous M/D/Y date appears in the chat.': 'diagnostic.cause.mdy',
  'An unambiguous D/M/Y date appears in the chat.': 'diagnostic.cause.dmy',
}

const defaultContext = {
  language: LANGUAGES.en,
  setLanguage: () => {},
  t: key => translations.en[key] || key,
  tDiagnosticCause: cause => diagnosticCauseKeys[cause]
    ? translations.en[diagnosticCauseKeys[cause]]
    : cause,
  tDiagnosticFileLabel: label => label === 'Selected file'
    ? translations.en['diagnostic.fileLabel.selected']
    : label,
}

const I18nContext = createContext(defaultContext)

export const normalizeLanguage = language => (
  language === LANGUAGES.es ? LANGUAGES.es : LANGUAGES.en
)

export const getBrowserLanguage = browserLanguage => (
  String(browserLanguage || '').toLowerCase().startsWith('es')
    ? LANGUAGES.es
    : LANGUAGES.en
)

export const getInitialLanguage = ({
  storage,
  browserLanguage,
} = {}) => {
  try {
    const storedLanguage = storage?.getItem(LANGUAGE_STORAGE_KEY)
    if (storedLanguage) return normalizeLanguage(storedLanguage)
  } catch (error) {
    // Ignore blocked storage; browser language is still a safe default.
  }

  return getBrowserLanguage(browserLanguage)
}

export const I18nProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => getInitialLanguage({
    storage: window.localStorage,
    browserLanguage: window.navigator.language,
  }))

  useEffect(() => {
    document.documentElement.lang = language

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    } catch (error) {
      // The selected language still works for this session when storage fails.
    }
  }, [language])

  const setLanguage = useCallback(nextLanguage => {
    setLanguageState(normalizeLanguage(nextLanguage))
  }, [])

  const value = useMemo(() => {
    const dictionary = translations[language]

    return {
      language,
      setLanguage,
      t: key => dictionary[key] || translations.en[key] || key,
      tDiagnosticCause: cause => diagnosticCauseKeys[cause]
        ? dictionary[diagnosticCauseKeys[cause]]
        : cause,
      tDiagnosticFileLabel: label => label === 'Selected file'
        ? dictionary['diagnostic.fileLabel.selected']
        : label,
    }
  }, [language, setLanguage])

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext)
