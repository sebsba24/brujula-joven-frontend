import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const modules = [
  { label: 'Empleo',      path: '/modulos/empleo' },
  { label: 'Educación',   path: '/modulos/educacion' },
  { label: 'Legal',       path: '/modulos/legal' },
  { label: 'Financiero',  path: '/modulos/financiero' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <nav className="bg-navy-900 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/modulos" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
              <span className="text-navy-900 font-bold text-sm">NS</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Next<span className="text-blue-400">Steps</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {modules.map(m => (
              <Link key={m.path} to={m.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === m.path
                    ? 'bg-blue-400 text-white'
                    : 'text-gray-200 hover:text-white hover:bg-navy-800'
                }`}>
                {m.label}
              </Link>
            ))}
          </div>

          {/* Hamburger */}
          <button onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-navy-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy-800 border-t border-navy-950 px-4 py-3 space-y-1">
          {modules.map(m => (
            <Link key={m.path} to={m.path} onClick={() => setOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                pathname === m.path ? 'bg-blue-400 text-white' : 'text-gray-200'
              }`}>
              {m.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}