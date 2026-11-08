/**
 * Tests of the routes and the session of the application.
 */

import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { clearAccessToken, getAccessToken, setAccessToken } from './auth/session'

beforeEach(() => {
  window.history.pushState({}, '', '/')
})

afterEach(() => {
  cleanup()
  clearAccessToken()
})

describe('App', () => {
  it('sends an unauthenticated customer to the login page', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('shows the home page when there is an open session', () => {
    setAccessToken('token-123')

    render(<App />)

    expect(screen.getByRole('heading', { name: /portal del cliente/i })).toBeInTheDocument()
  })

  it('closes the session and returns to the login page', async () => {
    const user = userEvent.setup()
    setAccessToken('token-123')
    render(<App />)

    await user.click(screen.getByRole('button', { name: /cerrar sesión/i }))

    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument()
    expect(getAccessToken()).toBeNull()
  })
})
