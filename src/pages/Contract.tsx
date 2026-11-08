/**
 * "Mi contrato" (KAN-352): customer code, tariff, socioeconomic group and meters of the customer.
 */

import { useEffect, useState } from 'react'
import { ApiError, getMyProfile } from '../api/client'
import type { ProfileResponse, TariffType } from '../api/types'

const TARIFF_LABEL: Record<TariffType, string> = {
  standard: 'Estándar',
  dynamic: 'Dinámica',
}

/**
 * User-facing text of the tariff of the latest contract.
 *
 * @param tariff Tariff reported by the API.
 * @returns The label to show, or the message for a customer without a contract.
 */
function tariffLabel(tariff: TariffType | null): string {
  return tariff === null ? 'Sin contrato' : TARIFF_LABEL[tariff]
}

/**
 * Contract page of the customer.
 *
 * @returns The contract data, with the loading and error states.
 */
export default function Contract() {
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
        setError(
          caught instanceof ApiError
            ? caught.message
            : 'No pudimos cargar tu contrato. Revisa tu conexión.',
        )
        setProfile(null)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <main className="profile-page">
      <header className="app-header">
        <h1>Mi contrato</h1>
      </header>

      {error !== null && <p role="alert">{error}</p>}

      {profile === null && error === null && <p>Cargando contrato…</p>}

      {profile !== null && (
        <section aria-label="Datos del contrato">
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Código de cliente</dt>
              <dd>{profile.customer_code}</dd>
            </div>
            <div className="detail-row">
              <dt>Tarifa</dt>
              <dd>{tariffLabel(profile.tariff_type)}</dd>
            </div>
            <div className="detail-row">
              <dt>Grupo socioeconómico</dt>
              <dd>{profile.socioeconomic_group ?? 'No disponible'}</dd>
            </div>
            <div className="detail-row">
              <dt>Medidores</dt>
              <dd>
                {profile.meters.length === 0 ? (
                  'Sin medidores asociados.'
                ) : (
                  <ul className="value-list">
                    {profile.meters.map((meter) => (
                      <li key={meter.lclid}>{meter.lclid}</li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          </dl>
        </section>
      )}
    </main>
  )
}
