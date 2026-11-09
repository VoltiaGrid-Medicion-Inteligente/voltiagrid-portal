/**
 * Segmented switch between Spanish and English.
 */

import { useI18n } from '../i18n/I18nContext'
import type { Language } from '../i18n/translations'
import Icon from './Icon'

const LANGUAGES: readonly { code: Language; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
]

/**
 * Draws the language switch.
 *
 * @returns The segmented control of the language.
 */
export default function LanguageToggle() {
  const { language, setLanguage, t } = useI18n()

  return (
    <div className="language-switch" role="group" aria-label={t('language.toggle')}>
      <Icon name="globe" size={16} className="language-icon" />
      {LANGUAGES.map((item) => (
        <button
          key={item.code}
          type="button"
          className={item.code === language ? 'language-option is-active' : 'language-option'}
          onClick={() => setLanguage(item.code)}
          aria-pressed={item.code === language}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
