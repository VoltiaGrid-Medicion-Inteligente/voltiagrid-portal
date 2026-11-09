/**
 * Tests of the network page (KAN-352) with the API client replaced by a stub.
 */

import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as client from '../api/client'
import type { ProfileResponse } from '../api/types'
import Network from './Network'

vi.mock('../api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/client')>()
  return {
    ...actual,
    getMyProfile: vi.fn(),
  }
})

const profile: ProfileResponse = {
  customer_code: 'CU-MAC000002',
  tariff_type: 'standard',
  socioeconomic_group: 'Comfortable',
  meters: [
    {
      lclid: 'MAC000002',
      transformer: { code: 'TR-00001', capacity_kva: '100.00' },
      circuit: { code: 'CT-000' },
    },
  ],
}

beforeEach(() => {
  vi.mocked(client.getMyProfile).mockResolvedValue(profile)
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('Network page', () => {
  it('shows the chain from the meter to its transformer and circuit', async () => {
    render(
      <MemoryRouter>
        <Network />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Medidor MAC000002' })).toBeInTheDocument()
    expect(screen.getByText('TR-00001 · 100.00 kVA')).toBeInTheDocument()
    expect(screen.getByText('CT-000')).toBeInTheDocument()
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('shows a message when the customer has no meters', async () => {
    vi.mocked(client.getMyProfile).mockResolvedValue({ ...profile, meters: [] })

    render(
      <MemoryRouter>
        <Network />
      </MemoryRouter>,
    )

    expect(await screen.findByText('No hay medidores asociados.')).toBeInTheDocument()
  })

  it('shows an error when the API cannot be reached', async () => {
    vi.mocked(client.getMyProfile).mockRejectedValue(new TypeError('network'))

    render(
      <MemoryRouter>
        <Network />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos cargar tu red')
  })
})
