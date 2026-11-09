/**
 * Language context shared by the pages of the portal.
 */

import { createContext, useContext } from 'react'
import { es, type Language, type TranslationKey } from './translations'

/** State and operations that the language provider exposes to the portal. */
export interface I18nContextValue {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: (key: TranslationKey) => string
}

export const I18nContext = createContext<I18nContextValue>({
  language: 'es',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => es[key],
})

/**
 * Reads the language context.
 *
 * @returns The current language and the translator of the portal.
 */
export function useI18n(): I18nContextValue {
  return useContext(I18nContext)
}
