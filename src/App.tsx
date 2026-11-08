import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthProvider from './auth/AuthProvider'
import RequireAuth from './components/RequireAuth'
import Consumption from './pages/Consumption'
import Contract from './pages/Contract'
import Home from './pages/Home'
import Login from './pages/Login'
import Network from './pages/Network'
import NotFound from './pages/NotFound'

/**
 * Routes of the portal with the authentication provider around them.
 *
 * @returns The application router.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Home />} />
            <Route path="/consumo" element={<Consumption />} />
            <Route path="/contrato" element={<Contract />} />
            <Route path="/red" element={<Network />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
