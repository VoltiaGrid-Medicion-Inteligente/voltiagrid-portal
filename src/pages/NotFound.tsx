/**
 * Not found page of the portal.
 */

import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { useI18n } from '../i18n/I18nContext'

/**
 * Shows the page for an address that does not exist.
 *
 * @returns The not found page with a link back to the home page.
 */
export default function NotFound() {
  const { t } = useI18n()

  return (
    <main className="not-found">
      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <h1>{t('notFound.title')}</h1>
        <p>{t('notFound.text')}</p>
        <Link to="/" className="button button-primary">
          {t('notFound.back')}
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>
    </main>
  )
}
