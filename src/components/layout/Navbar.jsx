import { useState } from "react";
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from "../../context/AuthContext";
import UserMenu from "../ui/UserMenu";
import { Home, Compass, GraduationCap, Wallet, Briefcase } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Inicio',      path: '/modulos',            Icon: Home },
  { label: 'Test',        path: '/modulos/test',        Icon: Compass },
  { label: 'Educación',   path: '/modulos/educacion',   Icon: GraduationCap },
  { label: 'Financiero',  path: '/modulos/financiero',  Icon: Wallet },
  { label: 'Empleo',      path: '/modulos/empleo',      Icon: Briefcase },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { isAuthenticated } = useAuth()

  const isActive = (path) =>
    path === '/modulos' ? pathname === '/modulos' : pathname.startsWith(path)

  return (
    <nav className="bg-navy-900 sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/modulos" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-navy-900 font-extrabold text-sm">NS</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight hidden sm:block">
              Next<span className="text-blue-400">Steps</span>
            </span>
          </Link>

          {/* Desktop nav */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map(m => (
                <Link
                  key={m.path}
                  to={m.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive(m.path)
                      ? 'bg-blue-400 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  {m.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link
                to="/login"
                className="bg-blue-400 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-600 transition-all"
              >
                Iniciar sesión
              </Link>
            )}

            {/* Hamburger — móvil */}
            {isAuthenticated && (
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-navy-800 transition-colors"
                aria-label="Menú"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {open
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && isAuthenticated && (
        <div className="md:hidden bg-navy-800 border-t border-navy-950 px-4 py-3">
          <div className="grid grid-cols-2 gap-1">
            {NAV_LINKS.map(m => (
              <Link
                key={m.path}
                to={m.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(m.path)
                    ? 'bg-blue-400 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-navy-900'
                }`}
              >
                <m.Icon className="w-4 h-4" />
                {m.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
