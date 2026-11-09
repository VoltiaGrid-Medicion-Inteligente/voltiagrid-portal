/**
 * Home page of the customer portal.
 */

import { Link } from 'react-router-dom'
import EnergyScene from '../components/EnergyScene'
import Icon from '../components/Icon'
import { useI18n } from '../i18n/I18nContext'

/**
 * Shows the landing page of the authenticated customer.
 *
 * @returns The home page with the hero and the shortcuts of the portal.
 */
export default function Home() {
  const { t } = useI18n()

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{t('home.eyebrow')}</p>
          <h1>{t('home.title')}</h1>
          <p className="page-subtitle">{t('home.tagline')}</p>
        </div>
      </header>

      <section className="hero-card">
        <div className="hero-copy">
          <span className="hero-kicker">VoltiaGrid</span>
          <h2>{t('home.heroTitle')}</h2>
          <p className="hero-text">{t('home.heroText')}</p>
          <Link to="/consumo" className="button button-accent">
            {t('home.heroCta')}
            <Icon name="arrowRight" size={18} />
          </Link>
          <ul className="hero-features">
            <li>
              <Icon name="gauge" size={20} />
              <span>{t('home.featureControl')}</span>
            </li>
            <li>
              <Icon name="bolt" size={20} />
              <span>{t('home.featureEfficiency')}</span>
            </li>
            <li>
              <Icon name="shield" size={20} />
              <span>{t('home.featureReliability')}</span>
            </li>
          </ul>
        </div>
        <div className="hero-art">
          <EnergyScene className="hero-scene" />
        </div>
      </section>

      <section className="home-section" aria-label={t('home.quickTitle')}>
        <div className="section-heading">
          <h2>{t('home.quickTitle')}</h2>
          <span className="section-line" />
        </div>
        <div className="quick-grid">
          <Link to="/consumo" className="quick-card">
            <span className="quick-icon">
              <Icon name="consumption" size={22} />
            </span>
            <h3>{t('nav.consumption')}</h3>
            <p>{t('home.consumptionText')}</p>
            <span className="quick-link">
              {t('common.open')}
              <Icon name="arrowRight" size={16} />
            </span>
          </Link>

          <Link to="/contrato" className="quick-card">
            <span className="quick-icon">
              <Icon name="contract" size={22} />
            </span>
            <h3>{t('nav.contract')}</h3>
            <p>{t('home.contractText')}</p>
            <span className="quick-link">
              {t('common.open')}
              <Icon name="arrowRight" size={16} />
            </span>
          </Link>

          <Link to="/red" className="quick-card">
            <span className="quick-icon">
              <Icon name="network" size={22} />
            </span>
            <h3>{t('nav.network')}</h3>
            <p>{t('home.networkText')}</p>
            <span className="quick-link">
              {t('common.open')}
              <Icon name="arrowRight" size={16} />
            </span>
          </Link>
        </div>
      </section>
    </main>
  )
}
