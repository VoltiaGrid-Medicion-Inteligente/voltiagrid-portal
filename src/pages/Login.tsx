/**
 * Login page against the token endpoint of the customer consumption API.
 */

import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/AuthContext'

/**
 * Asks the customer for their credentials and opens a session.
 *
 * @returns The login form, or a redirect when a session is already open.
 */
export default function Login() {
  const { isAuthenticated, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const state = location.state as { from?: string } | null
  const redirectTo = state?.from ?? '/'

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  /**
   * Sends the credentials to the API and opens the session.
   *
   * @param event Submit event of the form.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await signIn({ username, password })
      navigate(redirectTo, { replace: true })
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) {
        setError('Usuario o contraseña incorrectos.')
      } else {
        setError('No se pudo iniciar sesión. Inténtalo de nuevo.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login">
      <h1>Iniciar sesión</h1>
      <p>Accede con el código de cliente y la contraseña de tu servicio.</p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error !== null && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}
