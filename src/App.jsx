import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
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
import './styles/tokens.css'
import ChatWidget from './components/ui/ChatWidget'

function AppLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
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
