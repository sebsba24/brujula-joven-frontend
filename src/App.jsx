import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import ModulesIndex from './pages/ModulesIndex'
import EmpleoPage    from './pages/modules/EmpleoPage'
import EducacionPage from './pages/modules/EducacionPage'
import LegalPage     from './pages/modules/LegalPage'
import FinancieroPage from './pages/modules/FinancieroPage'
import TestPage from './pages/modules/TestPage'
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
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
            <Route path="/modulos"            element={<ModulesIndex />} />
            <Route path="/modulos/empleo"     element={<EmpleoPage />} />
            <Route path="/modulos/educacion"  element={<EducacionPage />} />
            <Route path="/modulos/legal"      element={<LegalPage />} />
            <Route path="/modulos/financiero" element={<FinancieroPage />} />
            <Route path="/modulos/test"       element={<TestPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}