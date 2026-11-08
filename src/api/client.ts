/**
 * Typed fetch client of the VoltiaGrid customer consumption API.
 *
 * Every request carries the bearer token of the open session and answers with the types of
 * `./types`, which mirror the OpenAPI contract of `voltiagrid-api`. A `401` closes the session and
 * notifies the subscribers registered with `onUnauthorized`, so the portal can send the customer
 * back to the login page.
 */

import { clearAccessToken, getAccessToken } from '../auth/session'
import { API_URL } from '../config'
import type {
  DailyConsumptionResponse,
  ErrorResponse,
  EventsResponse,
  FieldError,
  TokenRequest,
  TokenResponse,
} from './types'

/** Error thrown when the API answers with a non-success status. */
export class ApiError extends Error {
  readonly status: number
  readonly errors: FieldError[]

  /**
   * Builds an error from the response of the API.
   *
   * @param status HTTP status of the response.
   * @param message Message read from the error body or a generic description.
   * @param errors Invalid fields reported by the API.
   */
  constructor(status: number, message: string, errors: FieldError[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

type UnauthorizedListener = () => void

const unauthorizedListeners = new Set<UnauthorizedListener>()

/**
 * Subscribes to the unauthorized responses of the API.
 *
 * @param listener Called after a `401` has cleared the session token.
 * @returns Function that removes the subscription.
 */
export function onUnauthorized(listener: UnauthorizedListener): () => void {
  unauthorizedListeners.add(listener)
  return () => {
    unauthorizedListeners.delete(listener)
  }
}

/**
 * Sends a request to the customer consumption API.
 *
 * @param path Path relative to the API base URL, including the query string.
 * @param init Fetch options of the request.
 * @returns Parsed body of the response.
 * @throws {ApiError} When the API answers with a non-success status.
 */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (init.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const token = getAccessToken()
  if (token !== null) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers })

  if (response.status === 401) {
    clearAccessToken()
    unauthorizedListeners.forEach((listener) => listener())
  }

  const body = await parseBody(response)
  if (!response.ok) {
    throw toApiError(response.status, body)
  }
  return body as T
}

/**
 * Reads the body of a response as JSON.
 *
 * @param response Response of the API.
 * @returns Parsed body, or `null` when it is not JSON.
 */
async function parseBody(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return null
  }
}

/**
 * Turns an error response into an `ApiError`.
 *
 * @param status HTTP status of the response.
 * @param body Parsed body of the response.
 * @returns Error with the detail and the invalid fields of the API.
 */
function toApiError(status: number, body: unknown): ApiError {
  const error = isErrorResponse(body) ? body : null
  return new ApiError(
    status,
    error?.detail ?? `Request failed with status ${status}`,
    error?.errors ?? [],
  )
}

/**
 * Narrows a value to the shared error body of the API.
 *
 * @param body Parsed body of a response.
 * @returns `true` when the body has the `ErrorResponse` shape.
 */
function isErrorResponse(body: unknown): body is ErrorResponse {
  return (
    typeof body === 'object' && body !== null && typeof (body as ErrorResponse).detail === 'string'
  )
}

/**
 * Requests a token from `POST /auth/token`.
 *
 * @param credentials Username and password of the customer.
 * @returns Token issued by the API.
 * @throws {ApiError} When the credentials are rejected.
 */
export async function login(credentials: TokenRequest): Promise<TokenResponse> {
  return request<TokenResponse>('/auth/token', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

/**
 * Reads `GET /me/consumption/daily` for one month.
 *
 * @param month Month as `YYYY-MM`.
 * @returns Daily consumption per tariff band of the authenticated customer.
 * @throws {ApiError} When the API rejects the request.
 */
export async function getMyDailyConsumption(month: string): Promise<DailyConsumptionResponse> {
  return request<DailyConsumptionResponse>(
    `/me/consumption/daily?month=${encodeURIComponent(month)}`,
  )
}

/**
 * Reads `GET /me/events` for one month.
 *
 * @param month Month as `YYYY-MM`.
 * @returns Demand-response events of the authenticated customer.
 * @throws {ApiError} When the API rejects the request.
 */
export async function getMyEvents(month: string): Promise<EventsResponse> {
  return request<EventsResponse>(`/me/events?month=${encodeURIComponent(month)}`)
}
