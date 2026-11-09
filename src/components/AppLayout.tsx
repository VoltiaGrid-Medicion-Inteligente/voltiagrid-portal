/**
 * Layout of the authenticated area: navigation, header actions and the page of the route.
 */

import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useI18n } from '../i18n/I18nContext'
import BrandMark from './BrandMark'
import Icon from './Icon'
import LanguageToggle from './LanguageToggle'
import ThemeToggle from './ThemeToggle'

/**
 * Builds the class of a navigation entry.
 *
 * @param isActive Whether the route of the entry is the current one.
 * @returns The class of the entry.
 */
function navClass(isActive: boolean): string {
  return isActive ? 'nav-entry is-active' : 'nav-entry'
}

/**
 * Wraps the authenticated pages of the portal.
 *
 * @returns The application shell with the navigation and the current page.
 */
export default function AppLayout() {
  const { signOut } = useAuth()
  const { t } = useI18n()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand" aria-label="VoltiaGrid">
          <BrandMark className="brand-mark" />
          <span className="brand-name">
            Voltia<span className="brand-name-accent">Grid</span>
          </span>
        </Link>
        <p className="brand-tagline">{t('brand.tagline')}</p>

        <nav className="side-nav" aria-label={t('nav.label')}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => navClass(isActive)}
            aria-label={t('nav.home')}
            title={t('nav.home')}
          >
            <Icon name="home" size={19} />
            <span>{t('nav.home')}</span>
          </NavLink>
          <NavLink
            to="/consumo"
            className={({ isActive }) => navClass(isActive)}
            aria-label={t('nav.consumption')}
            title={t('nav.consumption')}
          >
            <Icon name="consumption" size={19} />
            <span>{t('nav.consumption')}</span>
          </NavLink>
          <NavLink
            to="/contrato"
            className={({ isActive }) => navClass(isActive)}
            aria-label={t('nav.contract')}
            title={t('nav.contract')}
          >
            <Icon name="contract" size={19} />
            <span>{t('nav.contract')}</span>
          </NavLink>
          <NavLink
            to="/red"
            className={({ isActive }) => navClass(isActive)}
            aria-label={t('nav.network')}
            title={t('nav.network')}
          >
            <Icon name="network" size={19} />
            <span>{t('nav.network')}</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="logout-button"
            onClick={signOut}
            aria-label={t('nav.signOut')}
            title={t('nav.signOut')}
          >
            <Icon name="logout" size={18} />
            <span>{t('nav.signOut')}</span>
          </button>
        </div>
      </aside>

      <div className="app-body">
        <header className="topbar">
          <span className="topbar-brand">VoltiaGrid</span>
          <div className="topbar-actions">
            <ThemeToggle />
            <LanguageToggle />
            <span className="user-chip">
              <span className="user-avatar">
                <Icon name="user" size={17} />
              </span>
              <span className="user-chip-text">{t('user.account')}</span>
            </span>
          </div>
        </header>
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
