/**
 * Authentication context shared by the pages of the portal.
 */

import { createContext, useContext } from 'react'
import type { TokenRequest } from '../api/types'

/** Operations and state that the authentication provider exposes to the portal. */
export interface AuthContextValue {
  isAuthenticated: boolean
  signIn: (credentials: TokenRequest) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Reads the authentication context.
 *
 * @returns State and operations of the open session.
 * @throws {Error} When it is used outside an `AuthProvider`.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
