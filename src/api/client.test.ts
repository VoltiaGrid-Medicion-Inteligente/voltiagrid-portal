/**
 * Unit tests of the typed API client.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearAccessToken, getAccessToken, setAccessToken } from '../auth/session'
import { API_URL } from '../config'
import { ApiError, getMyDailyConsumption, getMyEvents, login, onUnauthorized } from './client'

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

const fetchMock = vi.fn()

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
  clearAccessToken()
})

describe('login', () => {
  it('posts the credentials to the token endpoint', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ access_token: 'token-123', token_type: 'bearer', expires_in: 3600 }),
    )

    const response = await login({ username: 'CU-MAC000002', password: 'demo-password' })

    expect(response.access_token).toBe('token-123')
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/auth/token`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ username: 'CU-MAC000002', password: 'demo-password' }),
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    )
  })

  it('reports the detail of a rejected login as an ApiError', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ detail: 'Wrong username or password' }, 401))

    await expect(login({ username: 'CU-MAC000002', password: 'wrong' })).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
      message: 'Wrong username or password',
    })
  })
})

describe('authenticated requests', () => {
  it('sends the bearer token and the month query', async () => {
    setAccessToken('token-123')
    fetchMock.mockResolvedValue(
      jsonResponse({
        customer_code: 'CU-MAC000002',
        month: '2013-03',
        has_estimated_readings: false,
        days: [],
      }),
    )

    const response = await getMyDailyConsumption('2013-03')

    expect(response.month).toBe('2013-03')
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/me/consumption/daily?month=2013-03`,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token-123' }),
      }),
    )
  })

  it('reads the demand-response events of the customer', async () => {
    setAccessToken('token-123')
    fetchMock.mockResolvedValue(
      jsonResponse({
        customer_code: 'CU-MAC000002',
        month: '2013-07',
        events: [],
        incentives_total: '0.36',
      }),
    )

    const response = await getMyEvents('2013-07')

    expect(response.incentives_total).toBe('0.36')
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/me/events?month=2013-07`, expect.anything())
  })

  it('exposes the invalid fields of a validation error', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          detail: 'Invalid body or parameters',
          errors: [{ field: 'month', message: 'String should match pattern' }],
        },
        422,
      ),
    )

    await expect(getMyDailyConsumption('March')).rejects.toMatchObject({
      status: 422,
      errors: [{ field: 'month', message: 'String should match pattern' }],
    })
  })

  it('clears the session and notifies subscribers on 401', async () => {
    setAccessToken('expired-token')
    const listener = vi.fn()
    const unsubscribe = onUnauthorized(listener)
    fetchMock.mockResolvedValue(jsonResponse({ detail: 'Token expired' }, 401))

    await expect(getMyDailyConsumption('2013-03')).rejects.toBeInstanceOf(ApiError)

    expect(getAccessToken()).toBeNull()
    expect(listener).toHaveBeenCalledOnce()
    unsubscribe()
  })
})
