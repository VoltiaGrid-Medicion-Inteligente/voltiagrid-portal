/**
 * "Mi contrato" (KAN-352): customer code, tariff, socioeconomic group and meters of the customer.
 */

import { useEffect, useState } from 'react'
import { ApiError, getMyProfile } from '../api/client'
import type { ProfileResponse, TariffType } from '../api/types'
import Icon from '../components/Icon'
import { useI18n } from '../i18n/I18nContext'
import type { TranslationKey } from '../i18n/translations'

const TARIFF_KEY: Record<TariffType, TranslationKey> = {
  standard: 'contract.tariff.standard',
  dynamic: 'contract.tariff.dynamic',
}

/**
 * User-facing text of the tariff of the latest contract.
 *
 * @param tariff Tariff reported by the API.
 * @param t Translator of the portal.
 * @returns The label to show, or the message for a customer without a contract.
 */
function tariffLabel(tariff: TariffType | null, t: (key: TranslationKey) => string): string {
  return tariff === null ? t('contract.tariff.none') : t(TARIFF_KEY[tariff])
}

/**
 * Contract page of the customer.
 *
 * @returns The contract data, with the loading and error states.
 */
export default function Contract() {
  const { t } = useI18n()
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getMyProfile()
      .then((response) => {
        if (!active) return
        setError(null)
        setProfile(response)
      })
      .catch((caught: unknown) => {
        if (!active) return
        setError(caught instanceof ApiError ? caught.message : t('contract.error'))
        setProfile(null)
      })
    return () => {
      active = false
    }
  }, [t])

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{t('contract.eyebrow')}</p>
          <h1>{t('contract.title')}</h1>
          <p className="page-subtitle">{t('contract.subtitle')}</p>
        </div>
      </header>

      {error !== null && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      {profile === null && error === null && (
        <div className="card loading-card">
          <span className="spinner" aria-hidden="true" />
          <p>{t('contract.loading')}</p>
        </div>
      )}

      {profile !== null && (
        <div className="contract-grid">
          <section className="card contract-card" aria-label={t('contract.section')}>
            <div className="card-heading">
              <div>
                <h2>{t('contract.section')}</h2>
                <p className="card-hint">{t('contract.sectionHint')}</p>
              </div>
              <span className="card-icon">
                <Icon name="contract" size={22} />
              </span>
            </div>

            <dl className="detail-list">
              <div className="detail-row">
                <dt>
                  <Icon name="user" size={17} />
                  {t('contract.customerCode')}
                </dt>
                <dd>{profile.customer_code}</dd>
              </div>
              <div className="detail-row">
                <dt>
                  <Icon name="contract" size={17} />
                  {t('contract.tariff')}
                </dt>
                <dd>{tariffLabel(profile.tariff_type, t)}</dd>
              </div>
              <div className="detail-row">
                <dt>
                  <Icon name="gauge" size={17} />
                  {t('contract.group')}
                </dt>
                <dd>{profile.socioeconomic_group ?? t('contract.noGroup')}</dd>
              </div>
            </dl>
          </section>

          <section className="card contract-card" aria-label={t('contract.meters')}>
            <div className="card-heading">
              <div>
                <h2>{t('contract.meters')}</h2>
                <p className="card-hint">{t('contract.metersHint')}</p>
              </div>
              <span className="card-icon">
                <Icon name="meter" size={22} />
              </span>
            </div>

            {profile.meters.length === 0 ? (
              <p className="empty-inline">{t('contract.noMeters')}</p>
            ) : (
              <ul className="meter-list">
                {profile.meters.map((meter) => (
                  <li key={meter.lclid} className="meter-item">
                    <span className="chain-node">
                      <Icon name="meter" size={22} />
                    </span>
                    <span className="meter-copy">
                      <strong>{meter.lclid}</strong>
                      <small>
                        {meter.transformer.code} · {meter.circuit.code}
                      </small>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </main>
  )
}
