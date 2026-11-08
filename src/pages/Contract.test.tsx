/**
 * Tests of the contract page (KAN-352) with the API client replaced by a stub.
 */

import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as client from '../api/client'
import type { ProfileResponse } from '../api/types'
import Contract from './Contract'

vi.mock('../api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/client')>()
  return {
    ...actual,
    getMyProfile: vi.fn(),
  }
})

const profile: ProfileResponse = {
  customer_code: 'CU-MAC000002',
  tariff_type: 'dynamic',
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

describe('Contract page', () => {
  it('shows the code, the tariff, the group and the meters', async () => {
    render(
      <MemoryRouter>
        <Contract />
      </MemoryRouter>,
    )

    expect(await screen.findByText('CU-MAC000002')).toBeInTheDocument()
    expect(screen.getByText('Dinámica')).toBeInTheDocument()
    expect(screen.getByText('Comfortable')).toBeInTheDocument()
    expect(screen.getByText('MAC000002')).toBeInTheDocument()
  })

  it('marks a customer without a contract', async () => {
    vi.mocked(client.getMyProfile).mockResolvedValue({
      ...profile,
      tariff_type: null,
      socioeconomic_group: null,
    })

    render(
      <MemoryRouter>
        <Contract />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Sin contrato')).toBeInTheDocument()
    expect(screen.getByText('No disponible')).toBeInTheDocument()
  })

  it('shows a message when the customer has no meters', async () => {
    vi.mocked(client.getMyProfile).mockResolvedValue({ ...profile, meters: [] })

    render(
      <MemoryRouter>
        <Contract />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Sin medidores asociados.')).toBeInTheDocument()
  })

  it('shows an error when the API cannot be reached', async () => {
    vi.mocked(client.getMyProfile).mockRejectedValue(new TypeError('network'))

    render(
      <MemoryRouter>
        <Contract />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos cargar tu contrato')
  })
})
