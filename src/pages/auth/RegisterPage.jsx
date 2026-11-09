import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { registerUser } from '../../services/api'

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

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: '', email: '', password: '',
    tipo_documento: '', numero_documento: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await registerUser(form)
      navigate('/login')
    } catch (err) {
      setError('Error al crear la cuenta. Verifica los datos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left panel — hidden on narrow screens */}
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
            <span style={{ color: '#fff' }}>Next</span>
            <span style={{ color: 'var(--cyanbr)' }}>Steps</span>
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
        overflowY: 'auto',
      }}>
        <div style={{ maxWidth: 400, width: '100%' }}>
          <div style={{ font: '700 13px Archivo', color: 'var(--cyandk)' }}>Paso 1 de 3</div>
          <h1 style={{ font: '800 26px Archivo', letterSpacing: '-0.02em', margin: '8px 0 4px' }}>
            Crea tu cuenta
          </h1>
          <p style={{ font: '500 14px Archivo', color: 'var(--muted)', margin: '0 0 26px' }}>
            Es gratis y te toma menos de un minuto.
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
              <label style={{ font: '700 13px Archivo', display: 'block', marginBottom: 7 }}>Nombre completo</label>
              <input type="text" name="nombre" placeholder="Tu nombre" className="input" onChange={handleChange} required />
            </div>

            <div>
              <label style={{ font: '700 13px Archivo', display: 'block', marginBottom: 7 }}>Correo electrónico</label>
              <input type="email" name="email" placeholder="tu@correo.com" className="input" onChange={handleChange} required />
            </div>

            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={{ font: '700 13px Archivo', display: 'block', marginBottom: 7 }}>Tipo de documento</label>
                <select name="tipo_documento" className="input" onChange={handleChange} required>
                  <option value="">Selecciona…</option>
                  <option value="CC">Cédula de ciudadanía</option>
                  <option value="TI">Tarjeta de identidad</option>
                  <option value="CE">Cédula de extranjería</option>
                  <option value="PAS">Pasaporte</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ font: '700 13px Archivo', display: 'block', marginBottom: 7 }}>Número</label>
                <input type="text" name="numero_documento" placeholder="12345678" className="input" onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label style={{ font: '700 13px Archivo', display: 'block', marginBottom: 7 }}>Contraseña</label>
              <input type="password" name="password" placeholder="••••••••" className="input" onChange={handleChange} required />
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
              {loading ? 'Creando cuenta…' : (
                <>
                  Crear cuenta y empezar
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12 H19"/><path d="M13 6 L19 12 L13 18"/>
                  </svg>
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', font: '500 13px Archivo', color: 'var(--muted)' }}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" style={{ color: 'var(--cyandk)', fontWeight: 700 }}>
                Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
