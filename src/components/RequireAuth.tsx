/**
 * Route guard for the pages that need an open session.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

/**
 * Sends unauthenticated customers to the login page and remembers where they wanted to go.
 *
 * @returns The child routes when there is a session, or a redirect to `/login`.
 */
export default function RequireAuth() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
