/**
 * In-memory session token.
 *
 * The token only lives in memory: it is never written to localStorage or sessionStorage, so a
 * page reload requires logging in again. Reading it from a single module keeps every API request
 * and the authentication state in sync.
 */

let accessToken: string | null = null

/**
 * Current access token.
 *
 * @returns The bearer token of the open session, or `null` when there is none.
 */
export function getAccessToken(): string | null {
  return accessToken
}

/**
 * Stores the access token of a new session.
 *
 * @param token Bearer token returned by the authentication endpoint.
 */
export function setAccessToken(token: string): void {
  accessToken = token
}

/** Closes the session by forgetting the access token. */
export function clearAccessToken(): void {
  accessToken = null
}
