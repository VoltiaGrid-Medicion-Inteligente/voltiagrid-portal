/**
 * Home page of the customer portal.
 */

import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

/**
 * Shows the landing page of the authenticated customer.
 *
 * @returns The home page with the action that closes the session.
 */
export default function Home() {
  const { signOut } = useAuth()

  return (
    <main>
      <header className="app-header">
        <h1>VoltiaGrid · Portal del cliente</h1>
        <button type="button" onClick={signOut}>
          Cerrar sesión
        </button>
      </header>
      <p>Tu contrato, tu red y tu consumo de energía.</p>
      <p>
        <Link to="/consumo">Mi consumo</Link>
      </p>
    </main>
  )
}
