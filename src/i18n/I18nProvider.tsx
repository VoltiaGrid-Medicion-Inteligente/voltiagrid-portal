/**
 * Language provider of the portal.
 *
 * The chosen language lives in `localStorage` so it survives a reload, and it is reflected in the
 * `lang` attribute of the document.
 */

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext, type I18nContextValue } from './I18nContext'
import { dictionaries, type Language, type TranslationKey } from './translations'

const STORAGE_KEY = 'voltiagrid.language'

interface I18nProviderProps {
  children: ReactNode
}

/**
 * Reads the saved language.
 *
 * @returns The saved language, or Spanish when there is none.
 */
function readLanguage(): Language {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'es'
  } catch {
    return 'es'
  }
}

/**
 * Saves the chosen language.
 *
 * @param language Language to save.
 */
function saveLanguage(language: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, language)
  } catch {
    return
  }
}

/**
 * Holds the language of the portal.
 *
 * @param props Component properties.
 * @param props.children Routes that can read the language context.
 * @returns The language context provider.
 */
export default function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(readLanguage)

  useEffect(() => {
    document.documentElement.lang = language
    saveLanguage(language)
  }, [language])

  const setLanguage = useCallback((next: Language): void => {
    setLanguageState(next)
  }, [])

  const toggleLanguage = useCallback((): void => {
    setLanguageState((current) => (current === 'es' ? 'en' : 'es'))
  }, [])

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: (key: TranslationKey) => dictionaries[language][key],
    }),
    [language, setLanguage, toggleLanguage],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
