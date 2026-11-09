import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPerfilByUsuario, getRecomendacionesByUsuario, get2FAStatus, setup2FA, enable2FA, disable2FA } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const RASGO_NOMBRE = {
  R: "Realista", I: "Investigativo", A: "Artístico",
  S: "Social",   E: "Emprendedor",  C: "Convencional",
};

const RASGO_BAR_COLOR = {
  I: 'var(--cyan)',   R: 'var(--green)',
  E: 'var(--violet)', A: 'var(--sub)',
  S: 'var(--sub)',    C: 'var(--sub)',
};

const RASGO_DESCRIPCION = {
  R: "Actividades prácticas y concretas. Trabaja con herramientas, tecnología o entornos físicos.",
  I: "Analizar e investigar cómo funcionan las cosas. Pensamiento lógico y científico.",
  A: "Creatividad y expresión personal. Diseño, música, escritura y entornos flexibles.",
  S: "Trabajo con personas. Empático, comunicativo y con vocación de servicio.",
  E: "Roles de liderazgo. Tomar decisiones e influir en otros. Entornos competitivos.",
  C: "Organización y detalle. Datos, procesos claros y tareas bien definidas.",
};

// ==================== Componente 2FA ====================
function Seccion2FA() {
  const [status, setStatus] = useState(null)       // null | { totp_enabled }
  const [phase, setPhase]   = useState('idle')     // idle | setup | disabling
  const [setupData, setSetupData] = useState(null) // { secret, otpauth_uri }
  const [code, setCode]     = useState('')
  const [msg, setMsg]       = useState(null)       // { type: 'ok'|'err', text }
  const [busy, setBusy]     = useState(false)

  useEffect(() => {
    get2FAStatus().then(setStatus).catch(() => {})
  }, [])

  const startSetup = async () => {
    setBusy(true); setMsg(null)
    try {
      const data = await setup2FA()
      setSetupData(data)
      setPhase('setup')
    } catch { setMsg({ type: 'err', text: 'No se pudo iniciar la configuración.' }) }
    finally { setBusy(false) }
  }

  const confirmEnable = async (e) => {
    e.preventDefault(); setBusy(true); setMsg(null)
    try {
      await enable2FA(code)
      setStatus({ totp_enabled: true })
      setPhase('idle'); setCode('')
      setMsg({ type: 'ok', text: '¡2FA activado correctamente!' })
    } catch { setMsg({ type: 'err', text: 'Código incorrecto. Verifica tu app.' }) }
    finally { setBusy(false) }
  }

  const confirmDisable = async (e) => {
    e.preventDefault(); setBusy(true); setMsg(null)
    try {
      await disable2FA(code)
      setStatus({ totp_enabled: false })
      setPhase('idle'); setCode('')
      setMsg({ type: 'ok', text: '2FA desactivado.' })
    } catch { setMsg({ type: 'err', text: 'Código incorrecto.' }) }
    finally { setBusy(false) }
  }

  const qrUrl = setupData
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(setupData.otpauth_uri)}`
    : null

  return (
    <div style={{ padding: '0 44px 48px' }}>
      <div style={{ border: '1px solid var(--line)', borderRadius: 16, padding: 24, background: 'var(--surf)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: status?.totp_enabled ? 'rgba(47,190,87,.12)' : 'rgba(107,91,230,.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke={status?.totp_enabled ? 'var(--green)' : 'var(--violet)'}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
          </div>
          <div>
            <div style={{ font: '700 15px Archivo' }}>Autenticación de dos factores (2FA)</div>
            <div style={{ font: '500 12px Archivo', color: 'var(--muted)', marginTop: 2 }}>
              {status === null ? 'Cargando…'
                : status.totp_enabled ? '✅ Activado — tu cuenta está protegida con Google Authenticator'
                : 'Desactivado — agrega una capa extra de seguridad a tu cuenta'}
            </div>
          </div>
        </div>

        {/* Mensajes de feedback */}
        {msg && (
          <div style={{
            background: msg.type === 'ok' ? 'rgba(47,190,87,.1)' : 'rgba(194,10,0,.08)',
            border: `1px solid ${msg.type === 'ok' ? 'rgba(47,190,87,.25)' : 'rgba(194,10,0,.2)'}`,
            color: msg.type === 'ok' ? 'var(--greendk)' : '#c20a00',
            borderRadius: 10, padding: '10px 14px', font: '500 13px Archivo', marginBottom: 16,
          }}>
            {msg.text}
          </div>
        )}

        {/* Estado: desactivado → botón activar */}
        {phase === 'idle' && status && !status.totp_enabled && (
          <button onClick={startSetup} disabled={busy} style={{
            border: 0, background: 'var(--violet)', color: '#fff',
            font: '700 13px Archivo', padding: '10px 20px', borderRadius: 10, cursor: 'pointer',
          }}>
            {busy ? 'Cargando…' : 'Activar 2FA'}
          </button>
        )}

        {/* Estado: activado → botón desactivar */}
        {phase === 'idle' && status?.totp_enabled && (
          <button onClick={() => { setPhase('disabling'); setMsg(null) }} style={{
            border: '1px solid rgba(194,10,0,.3)', background: 'rgba(194,10,0,.06)',
            color: '#c20a00', font: '700 13px Archivo', padding: '10px 20px',
            borderRadius: 10, cursor: 'pointer',
          }}>
            Desactivar 2FA
          </button>
        )}

        {/* Fase setup: QR + código */}
        {phase === 'setup' && setupData && (
          <div>
            <p style={{ font: '500 13px Archivo', color: 'var(--muted)', margin: '0 0 16px' }}>
              Escanea el código QR con <strong>Google Authenticator</strong>, <strong>Authy</strong> u otra app TOTP, luego escribe el código de 6 dígitos para confirmar.
            </p>
            <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <img src={qrUrl} alt="QR 2FA" width={160} height={160}
                style={{ borderRadius: 12, border: '1px solid var(--line)' }} />
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ font: '700 12px Archivo', color: 'var(--muted)', marginBottom: 4 }}>
                  Clave manual (si no puedes escanear)
                </div>
                <code style={{
                  display: 'block', background: 'var(--bg)', border: '1px solid var(--line)',
                  borderRadius: 8, padding: '8px 12px', font: '600 13px monospace',
                  wordBreak: 'break-all', marginBottom: 18,
                }}>
                  {setupData.secret}
                </code>
                <form onSubmit={confirmEnable} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input
                    type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6}
                    placeholder="Código de 6 dígitos" className="input"
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                    style={{ textAlign: 'center', letterSpacing: '0.3em', fontSize: 18, fontWeight: 700 }}
                    autoFocus required
                  />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" disabled={busy || code.length !== 6} style={{
                      flex: 1, border: 0,
                      background: (busy || code.length !== 6) ? 'var(--sub)' : 'var(--green)',
                      color: '#fff', font: '700 13px Archivo', padding: '10px 0',
                      borderRadius: 10, cursor: (busy || code.length !== 6) ? 'not-allowed' : 'pointer',
                    }}>
                      {busy ? 'Verificando…' : 'Confirmar y activar'}
                    </button>
                    <button type="button" onClick={() => { setPhase('idle'); setMsg(null); setCode('') }} style={{
                      border: '1px solid var(--line)', background: 'var(--surf)',
                      font: '700 13px Archivo', padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
                      color: 'var(--muted)',
                    }}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Fase desactivar: pedir código */}
        {phase === 'disabling' && (
          <form onSubmit={confirmDisable} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ font: '500 13px Archivo', color: 'var(--muted)', margin: 0 }}>
              Para desactivar el 2FA ingresa el código actual de tu app autenticadora.
            </p>
            <input
              type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6}
              placeholder="Código de 6 dígitos" className="input"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              style={{ textAlign: 'center', letterSpacing: '0.3em', fontSize: 18, fontWeight: 700 }}
              autoFocus required
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={busy || code.length !== 6} style={{
                flex: 1, border: 0,
                background: (busy || code.length !== 6) ? 'var(--sub)' : '#c20a00',
                color: '#fff', font: '700 13px Archivo', padding: '10px 0',
                borderRadius: 10, cursor: (busy || code.length !== 6) ? 'not-allowed' : 'pointer',
              }}>
                {busy ? 'Desactivando…' : 'Desactivar'}
              </button>
              <button type="button" onClick={() => { setPhase('idle'); setMsg(null); setCode('') }} style={{
                border: '1px solid var(--line)', background: 'var(--surf)',
                font: '700 13px Archivo', padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
                color: 'var(--muted)',
              }}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// ==================== Perfil principal ====================

export default function Perfil() {
  const { token, user: authUser } = useAuth();
  const decoded = token ? jwtDecode(token) : null;
  const id_usuario = decoded?.sub;
  const nombre = authUser?.nombre || "Usuario";
  const iniciales = nombre.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const [perfil, setPerfil] = useState(null);
  const [recomendaciones, setRecomendaciones] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id_usuario) return;
    Promise.all([
      getPerfilByUsuario(id_usuario),
      getRecomendacionesByUsuario(id_usuario).catch(() => null),
    ]).then(([perfilData, recomData]) => {
      setPerfil(perfilData);
      if (recomData?.recomendaciones) setRecomendaciones(recomData.recomendaciones);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [id_usuario]);

  if (loading) return (
    <div style={{ padding: '60px 36px', textAlign: 'center', color: 'var(--muted)', font: '500 14px Archivo' }}>
      Cargando perfil…
    </div>
  );

  if (!perfil) return (
    <div style={{ minHeight: '100%', background: 'var(--bg)' }}>
      <div style={{ padding: '60px 36px 24px', textAlign: 'center', color: 'var(--muted)', font: '500 14px Archivo' }}>
        No se encontró el perfil vocacional.{" "}
        <Link to="/modulos/test-vocacional" style={{ color: 'var(--cyan)' }}>Realizar test</Link>
      </div>
      <div style={{ padding: '0 44px 8px' }}>
        <div style={{ font: '800 18px Archivo' }}>Seguridad de la cuenta</div>
      </div>
      <Seccion2FA />
    </div>
  );

  const rasgosSorted = Object.entries(perfil.perfil || {}).sort(([, a], [, b]) => b - a);
  const top2 = rasgosSorted.slice(0, 2);
  const topPct = Math.round(rasgosSorted[0]?.[1] || 0);

  const allCareers = [
    recomendaciones?.principal && { name: recomendaciones.principal, pct: topPct },
    ...(recomendaciones?.secundarias || []).map((c, i) => ({
      name: c,
      pct: Math.max(topPct - (i + 1) * 5, 55),
    })),
  ].filter(Boolean);

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg)' }}>

      {/* Banner navy */}
      <div style={{
        height: 120,
        background: 'linear-gradient(135deg, var(--navy) 0%, #1a2a5e 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -30, top: -50,
          width: 220, height: 220,
          background: 'radial-gradient(circle, rgba(134,224,90,.18), transparent 70%)',
        }} />
      </div>

      {/* Avatar + info */}
      <div style={{ padding: '0 40px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap', marginTop: -44, position: 'relative' }}>
          <div style={{
            width: 96, height: 96, borderRadius: 24, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
            border: '4px solid var(--bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            font: '800 38px Archivo', color: '#fff',
          }}>
            {iniciales}
          </div>
          <div style={{ paddingBottom: 6 }}>
            <h1 style={{ font: '800 24px/1.1 Archivo', margin: 0 }}>{nombre}</h1>
            <p style={{ font: '500 13px Archivo', color: 'var(--muted)', margin: '4px 0 0' }}>
              Estudiante · Perfil {perfil.top3?.map(k => RASGO_NOMBRE[k]).join('-')}
            </p>
          </div>
          <div style={{ marginLeft: 'auto', marginBottom: 6 }}>
            <button style={{
              border: '1px solid var(--line)', background: 'var(--surf)',
              font: '700 13px Archivo', padding: '9px 18px', borderRadius: 10, cursor: 'pointer',
              color: 'var(--text)',
            }}>
              Editar perfil
            </button>
          </div>
        </div>
      </div>

      {/* 2-col cards */}
      <div style={{ padding: '0 44px 36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Perfil vocacional */}
        <div style={{ border: '1px solid var(--line)', borderRadius: 16, padding: 24, background: 'var(--surf)' }}>
          <div style={{ font: '700 11px Archivo', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 8 }}>
            Perfil vocacional
          </div>
          <div style={{ font: '800 20px Archivo', marginBottom: 18 }}>
            {perfil.top3?.map(k => RASGO_NOMBRE[k]).join(' · ')}
          </div>
          {top2.map(([key, val]) => {
            const color = RASGO_BAR_COLOR[key] || 'var(--sub)';
            const pct = Math.round(val);
            return (
              <div key={key} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', font: '700 13px Archivo', marginBottom: 6 }}>
                  <span>{RASGO_NOMBRE[key]}</span>
                  <span style={{ color }}>{pct}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--bg)', borderRadius: 99 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99 }} />
                </div>
                <p style={{ font: '500 12px Archivo', color: 'var(--muted)', marginTop: 5 }}>
                  {RASGO_DESCRIPCION[key]}
                </p>
              </div>
            );
          })}
          <Link to="/modulos/test-vocacional" style={{
            font: '700 13px Archivo', color: 'var(--cyan)', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6,
          }}>
            Rehacer test
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12H19"/><path d="M13 6l6 6-6 6"/>
            </svg>
          </Link>
        </div>

        {/* Mi ruta activa */}
        <div style={{ border: '1px solid var(--line)', borderRadius: 16, padding: 24, background: 'var(--surf)' }}>
          <div style={{ font: '700 11px Archivo', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: 8 }}>
            Mi ruta activa
          </div>
          <div style={{ font: '800 18px Archivo', marginBottom: 16 }}>
            {recomendaciones?.principal || 'Sin ruta definida'}
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', font: '700 13px Archivo', marginBottom: 6 }}>
              <span>Progreso general</span>
              <span style={{ color: 'var(--green)' }}>35%</span>
            </div>
            <div style={{ height: 8, background: 'var(--bg)', borderRadius: 99 }}>
              <div style={{ width: '35%', height: '100%', background: 'var(--green)', borderRadius: 99 }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 20 }}>
            {[
              { label: 'Guardados', val: (recomendaciones?.secundarias?.length || 0) + (recomendaciones?.principal ? 1 : 0) },
              { label: 'Postulaciones', val: 0 },
              { label: 'Lecciones', val: 3 },
            ].map(s => (
              <div key={s.label} style={{
                textAlign: 'center', background: 'var(--bg)', borderRadius: 12, padding: '14px 8px',
              }}>
                <div style={{ font: '800 22px Archivo' }}>{s.val}</div>
                <div style={{ font: '500 11px Archivo', color: 'var(--muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recomendaciones / Guardados */}
      {allCareers.length > 0 && (
        <div style={{ padding: '0 44px 48px' }}>
          <div style={{ font: '800 18px Archivo', marginBottom: 18 }}>Carreras recomendadas</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {allCareers.map((career, i) => {
              const colors = [
                { bg: 'rgba(21,166,204,.12)', color: 'var(--cyandk)', label: 'Más afín' },
                { bg: 'rgba(47,190,87,.14)',  color: 'var(--greendk)', label: 'Recomendada' },
                { bg: 'rgba(107,91,230,.13)', color: 'var(--violetdk)', label: 'Explorar' },
              ];
              const c = colors[i % colors.length];
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  border: '1px solid var(--line)', borderRadius: 14, padding: '16px 20px',
                  background: 'var(--surf)',
                }}>
                  <div style={{
                    width: 46, height: 46, flexShrink: 0, borderRadius: 12,
                    background: c.bg, color: c.color,
                    font: '800 17px Archivo',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ font: '700 15px Archivo' }}>{career.name}</div>
                    <div style={{ font: '500 12px Archivo', color: 'var(--muted)', marginTop: 3 }}>
                      {c.label} · {career.pct}% afinidad
                    </div>
                  </div>
                  <Link to="/modulos/educacion" style={{
                    font: '700 12px Archivo', color: 'var(--cyan)', textDecoration: 'none',
                    border: '1px solid var(--cyan)', borderRadius: 8, padding: '6px 12px',
                  }}>
                    Explorar
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RIASEC completo */}
      <div style={{ padding: '0 44px 48px' }}>
        <div style={{ font: '800 18px Archivo', marginBottom: 18 }}>Todas tus áreas de interés</div>
        <div style={{
          border: '1px solid var(--line)', borderRadius: 16, padding: 24, background: 'var(--surf)',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {rasgosSorted.map(([key, val]) => {
            const color = RASGO_BAR_COLOR[key] || 'var(--sub)';
            const pct = Math.round(val);
            return (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', font: '700 13px Archivo', marginBottom: 6 }}>
                  <span>{RASGO_NOMBRE[key]}</span>
                  <span style={{ color }}>{pct}%</span>
                </div>
                <div style={{ height: 9, background: 'var(--bg)', borderRadius: 99 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seguridad: 2FA */}
      <div style={{ padding: '0 44px 8px' }}>
        <div style={{ font: '800 18px Archivo', marginBottom: 0 }}>Seguridad de la cuenta</div>
      </div>
      <Seccion2FA />
    </div>
  );
}
