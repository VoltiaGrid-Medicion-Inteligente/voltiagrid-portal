/**
 * Tests of the login page.
 */

import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearAccessToken, getAccessToken } from '../auth/session'
import AuthProvider from '../auth/AuthProvider'
import Home from './Home'
import Login from './Login'

/**
 * Builds a minimal response for the fetch mock.
 *
 * @param body JSON body of the response.
 * @param status HTTP status of the response.
 * @returns Response usable by the client.
 */
function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response
}

/**
 * Renders the login page with the routes it redirects to.
 *
 * @returns Result of the render.
 */
function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

/**
 * Fills the login form and submits it.
 *
 * @param username Customer code or internal username.
 * @param password Password of the account.
 */
async function submitLogin(username: string, password: string): Promise<void> {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText(/usuario/i), username)
  await user.type(screen.getByLabelText(/contraseña/i), password)
  await user.click(screen.getByRole('button', { name: /entrar/i }))
}

const fetchMock = vi.fn()

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  clearAccessToken()
})

describe('Login', () => {
  it('opens the session and shows the home page', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ access_token: 'token-123', token_type: 'bearer', expires_in: 3600 }),
    )

    renderLogin()
    await submitLogin('CU-MAC000002', 'demo-password')

    expect(await screen.findByRole('heading', { name: /portal del cliente/i })).toBeInTheDocument()
    expect(getAccessToken()).toBe('token-123')
  })

  it('shows an error when the credentials are rejected', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ detail: 'Wrong username or password' }, 401))

    renderLogin()
    await submitLogin('CU-MAC000002', 'wrong')

    expect(await screen.findByRole('alert')).toHaveTextContent(/usuario o contraseña incorrectos/i)
    expect(getAccessToken()).toBeNull()
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('shows a generic error when the API cannot be reached', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    renderLogin()
    await submitLogin('CU-MAC000002', 'demo-password')

    expect(await screen.findByRole('alert')).toHaveTextContent(/no se pudo iniciar sesión/i)
  })
})
