/**
 * "Mi red" (KAN-352): meter, transformer and circuit that feed the customer.
 */

import { useEffect, useState } from 'react'
import { ApiError, getMyProfile } from '../api/client'
import type { ProfileResponse } from '../api/types'

/**
 * Network page of the customer.
 *
 * @returns The chain meter to transformer to circuit of every meter, with the loading and error
 * states.
 */
export default function Network() {
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
            : 'No pudimos cargar tu red. Revisa tu conexión.',
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
        <h1>Mi red</h1>
      </header>

      {error !== null && <p role="alert">{error}</p>}

      {profile === null && error === null && <p>Cargando red…</p>}

      {profile !== null && profile.meters.length === 0 && <p>No hay medidores asociados.</p>}

      {profile !== null &&
        profile.meters.map((meter) => (
          <section key={meter.lclid} aria-label={`Red del medidor ${meter.lclid}`}>
            <h2>Medidor {meter.lclid}</h2>
            <ol className="network-chain">
              <li>
                <span className="chain-label">Medidor</span>
                <span>{meter.lclid}</span>
              </li>
              <li>
                <span className="chain-label">Transformador</span>
                <span>
                  {meter.transformer.code} · {meter.transformer.capacity_kva} kVA
                </span>
              </li>
              <li>
                <span className="chain-label">Circuito</span>
                <span>{meter.circuit.code}</span>
              </li>
            </ol>
          </section>
        ))}
    </main>
  )
}
