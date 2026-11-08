/**
 * Tests of the consumption page (KAN-353) with the API client replaced by a stub.
 */

import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as client from '../api/client'
import type { DailyConsumptionResponse } from '../api/types'
import { previousMonth } from '../consumption/summary'
import Consumption from './Consumption'

vi.mock('../api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/client')>()
  return {
    ...actual,
    getMyDailyConsumption: vi.fn(),
    getMyIntervals: vi.fn(),
  }
})

const daily = (month: string, energy: string, estimated = 0): DailyConsumptionResponse => ({
  customer_code: 'C-1',
  month,
  has_estimated_readings: estimated > 0,
  days: [
    {
      date: `${month}-01`,
      band_name: 'peak',
      energy_kwh: energy,
      cost: '10.00',
      readings: 48,
      estimated_readings: estimated,
    },
  ],
})

/**
 * Month the page opens on: the current one, as `YYYY-MM`.
 *
 * @returns Today's month.
 */
function currentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

beforeEach(() => {
  vi.mocked(client.getMyDailyConsumption).mockImplementation(async (month: string) =>
    month === previousMonth(currentMonth()) ? daily(month, '100.0') : daily(month, '120.0', 3),
  )
  vi.mocked(client.getMyIntervals).mockResolvedValue({
    customer_code: 'C-1',
    date: `${currentMonth()}-01`,
    intervals: [
      { start: '2013-03-01T00:00:00', band_name: 'off-peak', energy_kwh: '0.5', estimated: true },
    ],
  })
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('Consumption page', () => {
  it('shows the total of the month and the change against the month before', async () => {
    render(
      <MemoryRouter>
        <Consumption />
      </MemoryRouter>,
    )

    await waitFor(() => expect(screen.getByText(/Total del mes/)).toBeInTheDocument())
    expect(client.getMyDailyConsumption).toHaveBeenCalledWith(previousMonth(currentMonth()))
  })

  it('marks the days with estimated readings', async () => {
    render(
      <MemoryRouter>
        <Consumption />
      </MemoryRouter>,
    )

    await waitFor(() => expect(screen.getByText('Sí (3)')).toBeInTheDocument())
  })

  it('opens the 30-minute curve of a day when asked', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Consumption />
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('button', { name: 'Ver curva' }))

    await waitFor(() => expect(client.getMyIntervals).toHaveBeenCalled())
    expect(await screen.findByText(/1 lecturas estimadas\./)).toBeInTheDocument()
  })

  it('shows an error when the API cannot be reached', async () => {
    vi.mocked(client.getMyDailyConsumption).mockRejectedValue(new TypeError('network'))

    render(
      <MemoryRouter>
        <Consumption />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos cargar tu consumo')
  })
})
