/**
 * Tests of the authentication provider.
 */

import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getMyDailyConsumption } from '../api/client'
import AuthProvider from './AuthProvider'
import { clearAccessToken, getAccessToken, setAccessToken } from './session'

/**
 * Page that calls a protected endpoint when the customer asks for it.
 *
 * @returns A button that triggers the request.
 */
function PrivatePage() {
  return (
    <button
      type="button"
      onClick={() => {
        getMyDailyConsumption('2013-03').catch(() => undefined)
      }}
    >
      Cargar consumo
    </button>
  )
}

const fetchMock = vi.fn()

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
  setAccessToken('token-123')
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  clearAccessToken()
})

describe('AuthProvider', () => {
  it('redirects to the login page when the API answers 401', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Token expired' }),
    } as Response)

    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<PrivatePage />} />
            <Route path="/login" element={<h1>Iniciar sesión</h1>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /cargar consumo/i }))

    expect(await screen.findByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument()
    expect(getAccessToken()).toBeNull()
  })
})
