import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { loginUser, verify2FALogin } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const LogoIcon = () => (
  <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="11" fill="var(--navy2)" />
    <rect x="9" y="23" width="5.4" height="8" rx="1.4" fill="var(--cyanbr)" />
    <rect x="17.3" y="18" width="5.4" height="13" rx="1.4" fill="var(--cyan)" />
    <rect x="25.6" y="12" width="5.4" height="19" rx="1.4" fill="var(--green)" />
    <path d="M25 9.5 L32 9.5 L32 16.5" stroke="var(--lime)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M24 17 L32 9.5" stroke="var(--lime)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
  </svg>
)

const STEPS = [
  'Haz el test vocacional',
  'Recibe tus recomendaciones',
  'Avanza con tu ruta',
]

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  // Estado 2FA
  const [requires2FA, setRequires2FA] = useState(false)
  const [tempToken, setTempToken] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const finalizeLogin = (data) => {
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('user', JSON.stringify(data.user))
    login(data.user, data.access_token)
    navigate('/modulos')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loginUser(form)
      if (data.requires_2fa) {
        setTempToken(data.temp_token)
        setRequires2FA(true)
      } else {
        finalizeLogin(data)
      }
    } catch (err) {
      setError('Correo o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  const handle2FASubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await verify2FALogin(tempToken, otpCode)
      finalizeLogin(data)
    } catch (err) {
      setError('Código incorrecto o expirado. Intenta de nuevo.')
      setOtpCode('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left panel — hidden on narrow screens via CSS class */}
      <div className="auth-left-panel" style={{
        width: 400, flexShrink: 0,
        background: 'var(--navy)',
        color: '#fff',
        padding: '40px 38px',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -60, bottom: -60,
          width: 260, height: 260,
          background: 'radial-gradient(circle, rgba(36,197,232,.3), transparent 70%)',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, position: 'relative' }}>
          <LogoIcon />
          <span style={{ font: '800 20px Archivo' }}>
            <span style={{ color: '#fff' }}>Brújula</span>
            {' '}
            <span style={{ color: 'var(--cyanbr)' }}>Joven</span>
          </span>
        </div>
        <div style={{ marginTop: 46, position: 'relative' }}>
          <h2 style={{ font: '800 30px/1.15 Archivo', letterSpacing: '-0.02em', margin: 0 }}>
            Tu próximo paso empieza aquí.
          </h2>
          <p style={{ font: '500 15px/1.5 Archivo', color: 'rgba(255,255,255,.7)', marginTop: 16 }}>
            Descubre tu vocación y conecta educación, dinero y empleo en un solo lugar.
          </p>
        </div>
        <div style={{ marginTop: 38, display: 'flex', flexDirection: 'column', gap: 18, position: 'relative' }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 13, alignItems: 'center' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: i === 0 ? 'rgba(36,197,232,.18)' : 'rgba(255,255,255,.08)',
                color: i === 0 ? 'var(--cyanbr)' : 'rgba(255,255,255,.6)',
                font: '800 14px Archivo',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{i + 1}</div>
              <span style={{
                font: i === 0 ? '600 14px Archivo' : '500 14px Archivo',
                color: i === 0 ? '#fff' : 'rgba(255,255,255,.65)',
              }}>{step}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto', font: '500 12px Archivo', color: 'rgba(255,255,255,.4)', position: 'relative' }}>
          Más de 30.000 jóvenes ya empezaron.
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1,
        padding: '44px 48px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        background: 'var(--surf)',
      }}>
        <div style={{ maxWidth: 400, width: '100%' }}>

          {/* ── Paso 1: email + contraseña ── */}
          {!requires2FA && (
            <>
              <div style={{ font: '700 13px Archivo', color: 'var(--cyandk)' }}>Bienvenido de vuelta</div>
              <h1 style={{ font: '800 26px Archivo', letterSpacing: '-0.02em', margin: '8px 0 4px' }}>
                Inicia sesión
              </h1>
              <p style={{ font: '500 14px Archivo', color: 'var(--muted)', margin: '0 0 26px' }}>
                Continúa donde lo dejaste.
              </p>

              {error && (
                <div style={{
                  background: 'rgba(194,10,0,.08)', border: '1px solid rgba(194,10,0,.2)',
                  color: '#c20a00', borderRadius: 10, padding: '10px 14px',
                  font: '500 13px Archivo', marginBottom: 16,
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ font: '700 13px Archivo', display: 'block', marginBottom: 7 }}>
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@correo.com"
                    className="input"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label style={{ font: '700 13px Archivo', display: 'block', marginBottom: 7 }}>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="input"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link to="/forgot-password" style={{ font: '600 12px Archivo', color: 'var(--cyandk)' }}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    border: 0, background: loading ? 'var(--sub)' : 'var(--cyan)',
                    color: '#fff', font: '800 15px Archivo',
                    padding: 15, borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                    marginTop: 4,
                  }}
                >
                  {loading ? 'Ingresando…' : (
                    <>
                      Iniciar sesión
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12 H19"/><path d="M13 6 L19 12 L13 18"/>
                      </svg>
                    </>
                  )}
                </button>

                <div style={{ textAlign: 'center', font: '500 13px Archivo', color: 'var(--muted)' }}>
                  ¿No tienes cuenta?{' '}
                  <Link to="/register" style={{ color: 'var(--cyandk)', fontWeight: 700 }}>
                    Regístrate gratis
                  </Link>
                </div>
              </form>
            </>
          )}

          {/* ── Paso 2: código 2FA ── */}
          {requires2FA && (
            <>
              <button
                onClick={() => { setRequires2FA(false); setError('') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  font: '600 13px Archivo', color: 'var(--muted)', marginBottom: 20,
                  display: 'flex', alignItems: 'center', gap: 6 }}
              >
                ← Volver
              </button>

              <div style={{ font: '700 13px Archivo', color: 'var(--cyandk)' }}>
                Verificación en dos pasos
              </div>
              <h1 style={{ font: '800 26px Archivo', letterSpacing: '-0.02em', margin: '8px 0 4px' }}>
                Ingresa tu código
              </h1>
              <p style={{ font: '500 14px Archivo', color: 'var(--muted)', margin: '0 0 26px' }}>
                Abre Google Authenticator (o Authy) y escribe el código de 6 dígitos de Brújula Joven.
              </p>

              {/* Ícono visual */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 18,
                  background: 'rgba(36,197,232,.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2"/>
                    <line x1="12" y1="18" x2="12.01" y2="18"/>
                  </svg>
                </div>
              </div>

              {error && (
                <div style={{
                  background: 'rgba(194,10,0,.08)', border: '1px solid rgba(194,10,0,.2)',
                  color: '#c20a00', borderRadius: 10, padding: '10px 14px',
                  font: '500 13px Archivo', marginBottom: 16,
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handle2FASubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ font: '700 13px Archivo', display: 'block', marginBottom: 7 }}>
                    Código de 6 dígitos
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    placeholder="123456"
                    className="input"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    style={{ textAlign: 'center', letterSpacing: '0.35em', fontSize: 22, fontWeight: 700 }}
                    autoFocus
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  style={{
                    border: 0,
                    background: (loading || otpCode.length !== 6) ? 'var(--sub)' : 'var(--cyan)',
                    color: '#fff', font: '800 15px Archivo',
                    padding: 15, borderRadius: 12,
                    cursor: (loading || otpCode.length !== 6) ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                  }}
                >
                  {loading ? 'Verificando…' : 'Verificar y entrar'}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
