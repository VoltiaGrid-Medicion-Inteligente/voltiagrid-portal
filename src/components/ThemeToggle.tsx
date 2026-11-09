/**
 * Button that switches between the light and the dark theme.
 */

import { useI18n } from '../i18n/I18nContext'
import { useTheme } from '../theme/ThemeContext'
import Icon from './Icon'

/** Properties of the theme switch. */
export interface ThemeToggleProps {
  className?: string
}

/**
 * Draws the switch of the visual theme.
 *
 * @param props Class applied to the button.
 * @returns The theme switch.
 */
export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useI18n()
  const label = theme === 'dark' ? t('theme.toLight') : t('theme.toDark')

  return (
    <button
      type="button"
      className={['icon-button', className].filter(Boolean).join(' ')}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
    </button>
  )
}
