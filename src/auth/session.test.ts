/**
 * Unit tests of the in-memory session token.
 */

import { afterEach, describe, expect, it } from 'vitest'
import { clearAccessToken, getAccessToken, setAccessToken } from './session'

afterEach(() => {
  clearAccessToken()
})

describe('session', () => {
  it('starts without a token', () => {
    clearAccessToken()
    expect(getAccessToken()).toBeNull()
  })

  it('keeps the token in memory only', () => {
    setAccessToken('token-123')

    expect(getAccessToken()).toBe('token-123')
    expect(localStorage.length).toBe(0)
    expect(sessionStorage.length).toBe(0)
  })

  it('forgets the token when the session is cleared', () => {
    setAccessToken('token-123')

    clearAccessToken()

    expect(getAccessToken()).toBeNull()
  })
})
