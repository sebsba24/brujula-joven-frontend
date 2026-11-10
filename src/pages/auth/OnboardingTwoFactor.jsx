import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setup2FA, enable2FA } from '../../services/api'

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

export default function OnboardingTwoFactor() {
  const navigate = useNavigate()
  const [setupData, setSetupData] = useState(null) // { secret, otpauth_uri }
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setup2FA().then(setSetupData).catch(() => {
      setError('No pudimos iniciar la configuración de 2FA. Puedes activarlo más tarde desde tu perfil.')
    })
  }, [])

  const qrUrl = setupData
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(setupData.otpauth_uri)}`
    : null

  const handleEnable = async (e) => {
    e.preventDefault()
    setError('')
    if (!/^\d{6}$/.test(code)) {
      setError('Escribe el código de 6 dígitos de tu app de autenticación.')
      return
    }
    setBusy(true)
    try {
      await enable2FA(code)
      navigate('/modulos')
    } catch {
      setError('Código incorrecto. Verifica el código actual en tu app e intenta de nuevo.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: '24px 16px',
    }}>
      <div style={{
        maxWidth: 440, width: '100%',
        background: 'var(--surf)', border: '1px solid var(--line)',
        borderRadius: 16, padding: '34px 32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 20 }}>
          <LogoIcon />
          <span style={{ font: '800 18px Archivo', letterSpacing: '-0.02em' }}>
            <span style={{ color: 'var(--text)' }}>Brújula</span>
            {' '}
            <span style={{ color: 'var(--cyan)' }}>Joven</span>
          </span>
        </div>

        {/* Confirmación de registro */}
        <div style={{
          background: 'rgba(47,190,87,.1)', border: '1px solid rgba(47,190,87,.25)',
          color: 'var(--greendk)', borderRadius: 10, padding: '10px 14px',
          font: '600 13px Archivo', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 L9 17 L4 12" />
          </svg>
          ¡Cuenta creada con éxito!
        </div>

        <h1 style={{ font: '800 22px Archivo', letterSpacing: '-0.02em', margin: '0 0 6px' }}>
          Protege tu cuenta con 2FA
        </h1>
        <p style={{ font: '500 14px Archivo', color: 'var(--muted)', margin: '0 0 22px', lineHeight: 1.5 }}>
          Escanea el código con Google Authenticator (o Authy) y escribe el código de 6 dígitos para activar la verificación en dos pasos.
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

        {qrUrl && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <img src={qrUrl} alt="Código QR para 2FA" width={180} height={180}
              style={{ borderRadius: 12, border: '1px solid var(--line)' }} />
          </div>
        )}

        {setupData?.secret && (
          <p style={{ font: '500 12px Archivo', color: 'var(--sub)', textAlign: 'center', margin: '0 0 18px' }}>
            ¿No puedes escanear? Ingresa esta clave manualmente:<br />
            <span style={{ font: '700 13px monospace', color: 'var(--text)', letterSpacing: '.05em' }}>
              {setupData.secret}
            </span>
          </p>
        )}

        <form onSubmit={handleEnable} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Código de 6 dígitos"
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            style={{ textAlign: 'center', letterSpacing: '.3em', font: '700 16px Archivo' }}
          />
          <button
            type="submit"
            disabled={busy || !qrUrl}
            style={{
              border: 0, background: (busy || !qrUrl) ? 'var(--sub)' : 'var(--cyan)',
              color: '#fff', font: '800 15px Archivo', padding: 14, borderRadius: 12,
              cursor: (busy || !qrUrl) ? 'not-allowed' : 'pointer',
            }}
          >
            {busy ? 'Activando…' : 'Activar 2FA'}
          </button>
        </form>

        <button
          onClick={() => navigate('/modulos')}
          style={{
            width: '100%', marginTop: 12, background: 'none', border: 'none',
            color: 'var(--muted)', font: '600 13px Archivo', cursor: 'pointer', padding: 8,
          }}
        >
          Omitir por ahora
        </button>
      </div>
    </div>
  )
}
