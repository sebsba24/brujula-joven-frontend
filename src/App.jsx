import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from './components/layout/Navbar'
import ModulesIndex from './pages/ModulesIndex'
import EmpleoPage    from './pages/modules/EmpleoPage'
import EducacionPage from './pages/modules/EducacionPage'
import LegalPage     from './pages/modules/LegalPage'
import FinancieroPage from './pages/modules/FinancieroPage'
import TestPage from './pages/modules/TestPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPassword from './pages/auth/ForgotPassword'
import './styles/tokens.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"                   element={<Navigate to="/modulos" replace />} />
            <Route path="/login"              element={<LoginPage />} />
            <Route path="/register"           element={<RegisterPage />} />
            <Route path="/forgot-password"    element={<ForgotPassword />} />
            <Route path="/modulos"            element={<ProtectedRoute><ModulesIndex /></ProtectedRoute>} />
            <Route path="/modulos/empleo"     element={<ProtectedRoute><EmpleoPage /></ProtectedRoute>} />
            <Route path="/modulos/educacion"  element={<ProtectedRoute><EducacionPage /></ProtectedRoute>} />
            <Route path="/modulos/legal"      element={<ProtectedRoute><LegalPage /></ProtectedRoute>} />
            <Route path="/modulos/financiero" element={<ProtectedRoute><FinancieroPage /></ProtectedRoute>} />
            <Route path="/modulos/test"       element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}