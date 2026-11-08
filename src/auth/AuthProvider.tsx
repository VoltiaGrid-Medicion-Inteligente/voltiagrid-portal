/**
 * Authentication provider of the portal.
 *
 * The token lives in memory through the session module. The provider keeps the rendered state in
 * sync, closes the session when a request answers `401` and sends the customer to the login page.
 */

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, onUnauthorized } from '../api/client'
import type { TokenRequest } from '../api/types'
import { AuthContext, type AuthContextValue } from './AuthContext'
import { clearAccessToken, getAccessToken, setAccessToken } from './session'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Holds the session of the portal.
 *
 * @param props Component properties.
 * @param props.children Routes that can read the authentication context.
 * @returns The authentication context provider.
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(() => getAccessToken())

  useEffect(() => {
    return onUnauthorized(() => {
      setToken(null)
      navigate('/login', { replace: true })
    })
  }, [navigate])

  const signIn = useCallback(async (credentials: TokenRequest): Promise<void> => {
    const response = await login(credentials)
    setAccessToken(response.access_token)
    setToken(response.access_token)
  }, [])

  const signOut = useCallback((): void => {
    clearAccessToken()
    setToken(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated: token !== null, signIn, signOut }),
    [token, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
