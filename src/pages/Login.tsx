/**
 * Login page against the token endpoint of the customer consumption API.
 */

import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import BrandMark from '../components/BrandMark'
import EnergyScene from '../components/EnergyScene'
import Icon from '../components/Icon'
import LanguageToggle from '../components/LanguageToggle'
import ThemeToggle from '../components/ThemeToggle'
import { useI18n } from '../i18n/I18nContext'

/**
 * Asks the customer for their credentials and opens a session.
 *
 * @returns The login screen, or a redirect when a session is already open.
 */
export default function Login() {
  const { isAuthenticated, signIn } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const state = location.state as { from?: string } | null
  const redirectTo = state?.from ?? '/'

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  /**
   * Sends the credentials to the API and opens the session.
   *
   * @param event Submit event of the form.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await signIn({ username, password })
      navigate(redirectTo, { replace: true })
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) {
        setError(t('login.invalid'))
      } else {
        setError(t('login.failed'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-visual">
        <EnergyScene className="auth-scene" />
        <div className="auth-visual-overlay">
          <div className="auth-brand">
            <BrandMark className="auth-brand-mark" />
            <span className="auth-brand-name">
              Voltia<span className="brand-name-accent">Grid</span>
            </span>
          </div>
          <div className="auth-visual-copy">
            <span className="auth-kicker">{t('brand.tagline')}</span>
            <h2>{t('login.visualTitle')}</h2>
            <p>{t('login.visualText')}</p>
          </div>
          <ul className="auth-visual-points">
            <li>
              <Icon name="gauge" size={17} />
              <span>{t('home.featureControl')}</span>
            </li>
            <li>
              <Icon name="bolt" size={17} />
              <span>{t('home.featureEfficiency')}</span>
            </li>
            <li>
              <Icon name="shield" size={17} />
              <span>{t('home.featureReliability')}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-controls">
          <ThemeToggle />
          <LanguageToggle />
        </div>

        <div className="auth-card">
          <p className="eyebrow">{t('login.eyebrow')}</p>
          <h1>{t('login.title')}</h1>
          <p className="auth-subtitle">{t('login.subtitle')}</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username">{t('login.username')}</label>
              <div className="field-control">
                <Icon name="user" size={18} className="field-icon" />
                <input
                  id="username"
                  name="username"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">{t('login.password')}</label>
              <div className="field-control">
                <Icon name="shield" size={18} className="field-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="field-action"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                  title={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} />
                </button>
              </div>
            </div>

            {error !== null && (
              <p className="alert" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="button button-primary button-block"
              disabled={submitting}
            >
              {submitting ? t('login.submitting') : t('login.submit')}
              <Icon name="arrowRight" size={18} />
            </button>
          </form>

          <p className="auth-help">
            <Icon name="help" size={16} />
            <span>{t('login.help')}</span>
          </p>
        </div>
      </section>
    </main>
  )
}
