import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  Home, Compass, GraduationCap, Wallet, Briefcase, LogOut, PanelLeftClose, PanelLeftOpen, X,
} from 'lucide-react'

const NAV_LINKS = [
  { label: 'Inicio',         path: '/modulos',            Icon: Home },
  { label: 'Test vocacional', path: '/modulos/test',       Icon: Compass },
  { label: 'Educación',      path: '/modulos/educacion',   Icon: GraduationCap },
  { label: 'Finanzas',       path: '/modulos/financiero',  Icon: Wallet },
  { label: 'Empleo',         path: '/modulos/empleo',      Icon: Briefcase },
]

const LogoIcon = () => (
  <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="11" fill="var(--navy)" />
    <rect x="9" y="23" width="5.4" height="8" rx="1.4" fill="var(--cyanbr)" />
    <rect x="17.3" y="18" width="5.4" height="13" rx="1.4" fill="var(--cyan)" />
    <rect x="25.6" y="12" width="5.4" height="19" rx="1.4" fill="var(--green)" />
    <path d="M25 9.5 L32 9.5 L32 16.5" stroke="var(--lime)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M24 17 L32 9.5" stroke="var(--lime)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
  </svg>
)

export default function Sidebar({ isMobile = false, mobileOpen = false, onClose = () => {} }) {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [collapsedPref, setCollapsed] = useState(() => {
    try { return localStorage.getItem('sidebar_collapsed') === 'true' } catch { return false }
  })

  // En móvil el sidebar es un drawer: siempre expandido, nunca colapsado.
  const collapsed = isMobile ? false : collapsedPref

  const toggleCollapsed = () => {
    setCollapsed(prev => {
      const next = !prev
      try { localStorage.setItem('sidebar_collapsed', next) } catch {}
      return next
    })
  }

  const isActive = (path) =>
    path === '/modulos' ? pathname === '/modulos' : pathname.startsWith(path)

  const initial = user?.nombre?.[0]?.toUpperCase() || 'U'
  const firstName = user?.nombre?.split(' ')[0] || ''

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const asideStyle = isMobile
    ? {
        width: 236,
        background: 'var(--surf)',
        borderRight: '1px solid var(--line)',
        padding: '26px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        overflowY: 'auto',
        zIndex: 60,
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        boxShadow: mobileOpen ? '4px 0 24px rgba(12,24,38,.18)' : 'none',
      }
    : {
        width: collapsed ? 84 : 236,
        flexShrink: 0,
        background: 'var(--surf)',
        borderRight: '1px solid var(--line)',
        padding: collapsed ? '24px 0' : '26px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        transition: 'width 0.2s ease',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }

  return (
    <>
      {isMobile && mobileOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(12,24,38,.45)',
            zIndex: 55,
          }}
        />
      )}
    <aside style={asideStyle}>
      {/* Logo + toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '0 18px' : '0 6px',
      }}>
        {collapsed ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Link to="/modulos" style={{ display: 'flex' }}>
              <LogoIcon />
            </Link>
            <button
              onClick={toggleCollapsed}
              title="Expandir menú"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4, display: 'flex', alignItems: 'center', borderRadius: 8 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--muted)' }}
            >
              <PanelLeftOpen size={18} strokeWidth={1.8} />
            </button>
          </div>
        ) : (
          <>
            <Link to="/modulos" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
              <LogoIcon />
              <span style={{ font: '800 16px Archivo', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                <span style={{ color: 'var(--text)' }}>Brújula</span>
                {' '}
                <span style={{ color: 'var(--cyan)' }}>Joven</span>
              </span>
            </Link>
            <button
              onClick={isMobile ? onClose : toggleCollapsed}
              title={isMobile ? 'Cerrar menú' : 'Contraer menú'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4, display: 'flex', alignItems: 'center', borderRadius: 8 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--muted)' }}
            >
              {isMobile ? <X size={20} strokeWidth={1.8} /> : <PanelLeftClose size={18} strokeWidth={1.8} />}
            </button>
          </>
        )}
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {NAV_LINKS.map(({ label, path, Icon }) => {
          const active = isActive(path)
          return (
            <Link
              key={path}
              to={path}
              title={collapsed ? label : undefined}
              onClick={() => { if (isMobile) onClose() }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? 0 : 12,
                padding: collapsed ? '12px 0' : '11px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 11,
                background: active ? 'var(--navy)' : 'transparent',
                color: active ? '#fff' : 'var(--muted)',
                font: active ? '600 14px Archivo' : '500 14px Archivo',
                textDecoration: 'none',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'var(--bg)'
                  e.currentTarget.style.color = 'var(--text)'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--muted)'
                }
              }}
            >
              <Icon size={20} strokeWidth={1.9} />
              {!collapsed && label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: profile card or user avatar */}
      <div style={{ marginTop: 'auto' }}>
        {!collapsed ? (
          <div style={{
            background: 'linear-gradient(150deg, var(--navy), var(--navy2))',
            borderRadius: 14,
            padding: 18,
            color: '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
                color: '#fff',
                font: '800 14px Archivo',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {initial}
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ font: '700 13px Archivo' }}>{firstName}</div>
                <button
                  onClick={() => navigate('/perfil')}
                  style={{ font: '500 11px Archivo', color: 'rgba(255,255,255,.6)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Ver perfil
                </button>
              </div>
              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.5)', padding: 4 }}
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => navigate('/perfil')}
              title="Mi perfil"
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
                color: '#fff',
                font: '800 15px Archivo',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer',
              }}
            >
              {initial}
            </button>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4 }}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
    </>
  )
}
