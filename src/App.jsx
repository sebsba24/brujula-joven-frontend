import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import useIsMobile from './hooks/useIsMobile'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Sidebar from './components/layout/Sidebar'
import ModulesIndex from './pages/ModulesIndex'
import EmpleoPage    from './pages/modules/EmpleoPage'
import EducacionPage from './pages/modules/EducacionPage'
import FinancieroPage from './pages/modules/FinancieroPage'
import TestPage from './pages/modules/TestPage'
import Perfil from './pages/modules/Perfil'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPassword from './pages/auth/ForgotPassword'
import OnboardingTwoFactor from './pages/auth/OnboardingTwoFactor'
import './styles/tokens.css'
import ChatWidget from './components/ui/ChatWidget'

function AppLayout() {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar isMobile={isMobile} mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
        {isMobile && (
          <header style={{
            position: 'sticky', top: 0, zIndex: 40,
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px',
            background: 'var(--surf)', borderBottom: '1px solid var(--line)',
          }}>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'flex', padding: 4 }}
            >
              <Menu size={24} />
            </button>
            <span style={{ font: '800 17px Archivo', letterSpacing: '-0.02em' }}>
              <span style={{ color: 'var(--text)' }}>Brújula</span>
              {' '}
              <span style={{ color: 'var(--cyan)' }}>Joven</span>
            </span>
          </header>
        )}
        <Outlet />
      </main>
      <ChatWidget />
    </div>
  )
}

function AuthLayout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/modulos" replace />} />

        {/* Auth pages — no sidebar */}
        <Route element={<AuthLayout />}>
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/register"        element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Onboarding 2FA — autenticado pero sin sidebar */}
        <Route path="/registro-2fa" element={<ProtectedRoute><OnboardingTwoFactor /></ProtectedRoute>} />

        {/* App pages — with sidebar */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/modulos"            element={<ModulesIndex />} />
          <Route path="/modulos/empleo"     element={<EmpleoPage />} />
          <Route path="/modulos/educacion"  element={<EducacionPage />} />
          <Route path="/modulos/financiero" element={<FinancieroPage />} />
          <Route path="/modulos/test"       element={<TestPage />} />
          <Route path="/perfil"             element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
