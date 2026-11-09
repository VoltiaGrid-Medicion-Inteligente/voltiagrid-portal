import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthProvider from './auth/AuthProvider'
import AppLayout from './components/AppLayout'
import RequireAuth from './components/RequireAuth'
import I18nProvider from './i18n/I18nProvider'
import Consumption from './pages/Consumption'
import Contract from './pages/Contract'
import Home from './pages/Home'
import Login from './pages/Login'
import Network from './pages/Network'
import NotFound from './pages/NotFound'
import ThemeProvider from './theme/ThemeProvider'

/**
 * Routes of the portal with the theme, language and authentication providers around them.
 *
 * @returns The application router.
 */
export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<RequireAuth />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/consumo" element={<Consumption />} />
                  <Route path="/contrato" element={<Contract />} />
                  <Route path="/red" element={<Network />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  )
}
