import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import {
  getBrowserLanguage,
  getInitialLanguage,
  I18nProvider,
  LANGUAGE_STORAGE_KEY,
  useI18n,
} from './i18n'
import LanguageSwitcher from '../ui/shared/LanguageSwitcher'

const LanguageProbe = () => {
  const { language, setLanguage, t } = useI18n()

  return (
    <div>
      <p>{language}</p>
      <p>{t('file.choose')}</p>
      <button onClick={() => setLanguage('en')} type="button">EN</button>
      <button onClick={() => setLanguage('es')} type="button">ES</button>
    </div>
  )
}

describe('i18n', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.lang = ''
  })

  test('uses Spanish for es browser languages and English otherwise', () => {
    expect(getBrowserLanguage('es')).toBe('es')
    expect(getBrowserLanguage('es-AR')).toBe('es')
    expect(getBrowserLanguage('en-US')).toBe('en')
    expect(getBrowserLanguage('fr-FR')).toBe('en')
  })

  test('prefers the persisted language over the browser language', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en')

    expect(getInitialLanguage({
      storage: window.localStorage,
      browserLanguage: 'es-ES',
    })).toBe('en')
  })

  test('persists language changes and updates document lang without remounting content', () => {
    const { getByText } = render(
      <I18nProvider>
        <LanguageProbe />
      </I18nProvider>
    )

    fireEvent.click(getByText('ES'))

    expect(getByText('Elige un archivo')).toBeInTheDocument()
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es')
    expect(document.documentElement.lang).toBe('es')

    fireEvent.click(getByText('EN'))

    expect(getByText('Choose a file')).toBeInTheDocument()
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en')
    expect(document.documentElement.lang).toBe('en')
  })

  test('renders an accessible visible ES and EN language switcher', () => {
    const { getByLabelText, getByRole } = render(
      <I18nProvider>
        <LanguageSwitcher />
      </I18nProvider>
    )

    expect(getByLabelText('Language')).toBeInTheDocument()
    expect(getByRole('button', { name: 'ES' })).toBeVisible()
    expect(getByRole('button', { name: 'EN' })).toBeVisible()
  })
})
