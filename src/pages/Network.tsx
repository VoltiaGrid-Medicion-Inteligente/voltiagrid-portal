/**
 * "Mi red" (KAN-352): meter, transformer and circuit that feed the customer.
 */

import { useEffect, useState } from 'react'
import { ApiError, getMyProfile } from '../api/client'
import type { ProfileResponse } from '../api/types'
import Icon, { type IconName } from '../components/Icon'
import { useI18n } from '../i18n/I18nContext'
import type { TranslationKey } from '../i18n/translations'

const CHAIN_ICON: readonly { icon: IconName; key: TranslationKey }[] = [
  { icon: 'meter', key: 'network.meter' },
  { icon: 'transformer', key: 'network.transformer' },
  { icon: 'circuit', key: 'network.circuit' },
]

/**
 * Network page of the customer.
 *
 * @returns The chain meter to transformer to circuit of every meter, with the loading and error
 * states.
 */
export default function Network() {
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
        setError(caught instanceof ApiError ? caught.message : t('network.error'))
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
          <p className="eyebrow">{t('network.eyebrow')}</p>
          <h1>{t('network.title')}</h1>
          <p className="page-subtitle">{t('network.subtitle')}</p>
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
          <p>{t('network.loading')}</p>
        </div>
      )}

      {profile !== null && profile.meters.length === 0 && (
        <div className="card empty-state">
          <Icon name="network" size={28} />
          <p>{t('network.noMeters')}</p>
        </div>
      )}

      {profile !== null &&
        profile.meters.map((meter) => {
          const values = [
            meter.lclid,
            `${meter.transformer.code} · ${meter.transformer.capacity_kva} kVA`,
            meter.circuit.code,
          ]

          return (
            <section
              key={meter.lclid}
              className="card network-card"
              aria-label={`${t('network.title')} ${meter.lclid}`}
            >
              <div className="card-heading">
                <div>
                  <h2>
                    {t('network.meter')} {meter.lclid}
                  </h2>
                  <p className="card-hint">{t('network.hint')}</p>
                </div>
                <span className="card-icon">
                  <Icon name="network" size={22} />
                </span>
              </div>

              <ol className="network-chain">
                {CHAIN_ICON.map((item, index) => (
                  <li key={item.key}>
                    <span className="chain-node">
                      <Icon name={item.icon} size={22} />
                    </span>
                    <span className="chain-label">{t(item.key)}</span>
                    <span className="chain-value">{values[index]}</span>
                  </li>
                ))}
              </ol>
            </section>
          )
        })}
    </main>
  )
}
