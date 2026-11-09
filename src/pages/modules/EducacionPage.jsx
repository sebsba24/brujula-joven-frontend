import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { getRecomendacionesEducacion } from '../../services/api'
import { Search, CheckCircle2, ClipboardList, X, MapPin, Clock, GraduationCap, ExternalLink, BookOpen, Banknote } from 'lucide-react'

// ==================== HELPERS ====================

const RASGO_NOMBRE = { R: 'Realista', I: 'Investigador', A: 'Artístico', S: 'Social', E: 'Emprendedor', C: 'Convencional' }

const COSTO_LABEL = {
  gratuito: 'Gratuito',
  bajo:     'Costo bajo',
  medio:    'Costo medio',
  alto:     'Costo alto',
}

const MODALIDAD_LABEL = {
  presencial: 'Presencial',
  virtual:    'Virtual / a distancia',
  cualquiera: 'Presencial o virtual',
}

const CAPACIDAD_CONFIG = {
  alta:  { label: 'Alta',  bar: 'var(--green)',  pct: 90 },
  media: { label: 'Media', bar: '#F5A623',        pct: 55 },
  baja:  { label: 'Baja',  bar: '#E74C3C',        pct: 25 },
}

// Gradient by score
function cardGradient(score) {
  const pct = Math.round((score || 0) * 100)
  if (pct >= 88) return 'linear-gradient(135deg, var(--cyan), var(--cyandk))'
  if (pct >= 78) return 'linear-gradient(135deg, var(--green), var(--greendk))'
  if (pct >= 68) return 'linear-gradient(135deg, var(--violet), var(--violetdk))'
  return 'linear-gradient(135deg, #2E8FB0, var(--cyandk))'
}

function matchBadgeStyle(score) {
  const pct = Math.round((score || 0) * 100)
  if (pct >= 78) return { background: 'var(--lime)', color: 'var(--navy)' }
  return { background: 'rgba(255,255,255,.9)', color: 'var(--navy)' }
}

// ==================== SUBCOMPONENTES ====================

function BannerAlert({ type, children }) {
  const styles = {
    warn: { bg: 'rgba(245,166,35,.08)', border: 'rgba(245,166,35,.25)', label: '#B7791F' },
    info: { bg: 'rgba(21,166,204,.07)', border: 'rgba(21,166,204,.2)',  label: 'var(--cyandk)' },
  }
  const s = styles[type]
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14,
      padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
      flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  )
}

function ProgramaCard({ prog, onVerDetalle }) {
  const pct = Math.round((prog.score || 0) * 100)
  const badge = matchBadgeStyle(prog.score)

  return (
    <div style={{
      background: 'var(--surf)', border: '1px solid var(--line)',
      borderRadius: 15, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Gradient header */}
      <div style={{
        height: 80, background: cardGradient(prog.score),
        display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: 12,
      }}>
        {pct > 0 && (
          <span style={{
            font: '800 12px Archivo', padding: '4px 9px', borderRadius: 7,
            ...badge,
          }}>
            {pct}% match
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ font: '800 15px Archivo', color: 'var(--text)', marginBottom: 4 }}>
          {prog.nombre}
        </div>
        <div style={{ font: '500 12px Archivo', color: 'var(--muted)', marginBottom: 10 }}>
          {prog.inst} · {prog.ciudad}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{
            font: '600 11px Archivo', padding: '4px 8px', borderRadius: 7,
            background: 'rgba(21,166,204,.1)', color: 'var(--cyandk)',
          }}>{prog.tipo}</span>
          {prog.costo && (
            <span style={{
              font: '600 11px Archivo', padding: '4px 8px', borderRadius: 7,
              background: 'rgba(47,190,87,.1)', color: 'var(--greendk)',
            }}>{COSTO_LABEL[prog.costo] || prog.costo}</span>
          )}
          {prog.con_beca && (
            <span style={{
              font: '700 11px Archivo', padding: '4px 8px', borderRadius: 7,
              background: 'rgba(134,224,90,.2)', color: 'var(--greendk)',
            }}>Beca disponible</span>
          )}
        </div>
        {prog.modalidad?.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
            {prog.modalidad.map(m => (
              <span key={m} style={{
                font: '500 11px Archivo', color: 'var(--sub)',
                background: 'var(--bg)', padding: '3px 7px', borderRadius: 6,
              }}>
                {MODALIDAD_LABEL[m] || m}
              </span>
            ))}
          </div>
        )}
        {/* Ver detalle button */}
        <button
          onClick={() => onVerDetalle(prog)}
          style={{
            marginTop: 'auto', paddingTop: 14,
            font: '700 13px Archivo', color: 'var(--cyandk)',
            background: 'none', border: 'none', cursor: 'pointer',
            textAlign: 'left', display: 'flex', alignItems: 'center', gap: 5,
            padding: '14px 0 0',
          }}
        >
          Ver más detalles →
        </button>
      </div>
    </div>
  )
}

// ==================== MODAL DETALLE ====================

function ModalDetalle({ prog, onClose }) {
  const pct = Math.round((prog.score || 0) * 100)

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg)', borderRadius: 20,
          width: '100%', maxWidth: 540,
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 24px 64px rgba(0,0,0,.3)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header con gradiente */}
        <div style={{
          height: 120, background: cardGradient(prog.score),
          borderRadius: '20px 20px 0 0', position: 'relative',
          display: 'flex', alignItems: 'flex-end', padding: '16px 20px',
          flexShrink: 0,
        }}>
          {pct > 0 && (
            <span style={{
              font: '800 13px Archivo', padding: '5px 11px', borderRadius: 8,
              ...matchBadgeStyle(prog.score),
              position: 'absolute', top: 16, left: 20,
            }}>
              {pct}% match con tu perfil
            </span>
          )}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 14, right: 14,
              background: 'rgba(0,0,0,.2)', border: 'none', borderRadius: '50%',
              width: 32, height: 32, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={16} color="#fff" />
          </button>
          <div>
            <div style={{ font: '800 19px Archivo', color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,.3)' }}>
              {prog.nombre}
            </div>
            <div style={{ font: '500 13px Archivo', color: 'rgba(255,255,255,.85)' }}>
              {prog.inst}
            </div>
          </div>
        </div>

        {/* Cuerpo */}
        <div style={{ padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Chips de info rápida */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 5,
              font: '600 12px Archivo', padding: '6px 11px', borderRadius: 8,
              background: 'rgba(21,166,204,.1)', color: 'var(--cyandk)',
            }}>
              <GraduationCap size={13} />{prog.tipo}
            </span>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 5,
              font: '600 12px Archivo', padding: '6px 11px', borderRadius: 8,
              background: 'rgba(47,190,87,.1)', color: 'var(--greendk)',
            }}>
              <Banknote size={13} />{COSTO_LABEL[prog.costo] || prog.costo}
            </span>
            {prog.ciudad && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: 5,
                font: '600 12px Archivo', padding: '6px 11px', borderRadius: 8,
                background: 'var(--surf)', color: 'var(--muted)',
                border: '1px solid var(--line)',
              }}>
                <MapPin size={13} />{prog.ciudad}
              </span>
            )}
            {prog.duracion && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: 5,
                font: '600 12px Archivo', padding: '6px 11px', borderRadius: 8,
                background: 'var(--surf)', color: 'var(--muted)',
                border: '1px solid var(--line)',
              }}>
                <Clock size={13} />{prog.duracion}
              </span>
            )}
          </div>

          {/* Descripción */}
          {prog.descripcion && (
            <div>
              <div style={{ font: '700 12px Archivo', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>
                Sobre el programa
              </div>
              <p style={{ font: '400 14px Archivo', color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
                {prog.descripcion}
              </p>
            </div>
          )}

          {/* Requisitos */}
          {prog.requisitos && (
            <div style={{
              background: 'var(--surf)', border: '1px solid var(--line)',
              borderRadius: 12, padding: '14px 16px',
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}>
              <BookOpen size={16} color="var(--cyandk)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ font: '700 12px Archivo', color: 'var(--muted)', marginBottom: 4 }}>Requisitos de ingreso</div>
                <div style={{ font: '500 13px Archivo', color: 'var(--text)' }}>{prog.requisitos}</div>
              </div>
            </div>
          )}

          {/* Modalidad */}
          {prog.modalidad?.length > 0 && (
            <div>
              <div style={{ font: '700 12px Archivo', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>
                Modalidad
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {prog.modalidad.map(m => (
                  <span key={m} style={{
                    font: '600 12px Archivo', padding: '6px 12px', borderRadius: 8,
                    background: 'var(--surf)', color: 'var(--text)',
                    border: '1px solid var(--line)',
                  }}>
                    {MODALIDAD_LABEL[m] || m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Beca */}
          {prog.con_beca && (
            <div style={{
              background: 'rgba(134,224,90,.08)', border: '1px solid rgba(134,224,90,.3)',
              borderRadius: 12, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <CheckCircle2 size={16} color="var(--greendk)" />
              <span style={{ font: '600 13px Archivo', color: 'var(--greendk)' }}>
                Este programa tiene becas o financiación disponible
              </span>
            </div>
          )}

          {/* CTA */}
          {prog.url && (
            <a
              href={prog.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'var(--cyan)', color: '#fff',
                font: '700 14px Archivo', padding: '13px 24px',
                borderRadius: 12, textDecoration: 'none',
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Visitar sitio oficial de {prog.inst}
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ==================== PÁGINA ====================

const FILTROS_TIPO  = ['Todos', 'Técnico', 'Tecnológico', 'Universitario']
const FILTROS_COSTO = ['Todos', 'gratuito', 'bajo', 'medio', 'alto']
const TABS = ['Carreras', 'Becas', 'Cursos', 'Oficios técnicos']

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        font: active ? '700 12px Archivo' : '600 12px Archivo',
        color: active ? '#fff' : 'var(--muted)',
        background: active ? 'var(--cyan)' : 'var(--surf)',
        border: active ? 'none' : '1px solid var(--line)',
        padding: '8px 14px', borderRadius: 99,
        cursor: 'pointer', transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

export default function EducacionPage() {
  const { token } = useAuth()
  const user = token ? jwtDecode(token) : null

  const [data, setData]         = useState(null)
  const [cargando, setCargando] = useState(true)
  const [filtroTipo, setFiltroTipo]   = useState('Todos')
  const [filtroCosto, setFiltroCosto] = useState('Todos')
  const [tabActivo, setTabActivo]     = useState('Carreras')
  const [mostrarBecas, setMostrarBecas] = useState(false)
  const [progSeleccionado, setProgSeleccionado] = useState(null)

  const handleVerDetalle = useCallback((prog) => setProgSeleccionado(prog), [])
  const handleCerrarModal = useCallback(() => setProgSeleccionado(null), [])

  useEffect(() => {
    if (!token) return
    if (!user?.sub) { setCargando(false); return }
    setCargando(true)
    getRecomendacionesEducacion(user.sub)
      .then(res => { setData(res); setCargando(false) })
      .catch(() => { setCargando(false) })
  }, [token])

  const programasFiltrados = (data?.programas || []).filter(p => {
    if (filtroTipo  !== 'Todos' && p.tipo  !== filtroTipo)  return false
    if (filtroCosto !== 'Todos' && p.costo !== filtroCosto) return false
    return true
  })

  const cap = data?.capacidad_economica ? CAPACIDAD_CONFIG[data.capacidad_economica] : null

  if (cargando) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <span style={{ font: '500 14px Archivo', color: 'var(--muted)' }}>Cargando recomendaciones…</span>
      </div>
    )
  }

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>

      {/* Header */}
      <div style={{ padding: '30px 36px 0' }}>
        <div style={{ font: '700 13px Archivo', color: 'var(--cyandk)', marginBottom: 6 }}>
          Módulo Educación
        </div>
        <h1 style={{ font: '800 27px Archivo', letterSpacing: '-.02em', margin: '0 0 18px', color: 'var(--text)' }}>
          Explora tu camino de estudios
        </h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line)' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setTabActivo(tab)}
              style={{
                font: tabActivo === tab ? '700 14px Archivo' : '600 14px Archivo',
                color: tabActivo === tab ? 'var(--cyandk)' : 'var(--muted)',
                padding: '0 14px 12px',
                borderBottom: tabActivo === tab ? '2px solid var(--cyan)' : '2px solid transparent',
                background: 'none', border: 'none',
                borderBottomWidth: 2,
                borderBottomStyle: 'solid',
                borderBottomColor: tabActivo === tab ? 'var(--cyan)' : 'transparent',
                cursor: 'pointer', transition: 'all 0.15s',
                paddingBottom: 12,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filters bar */}
      <div style={{ padding: '16px 36px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid var(--line)' }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          background: 'var(--surf)', border: '1px solid var(--line)',
          borderRadius: 10, padding: '9px 14px', flex: '1', maxWidth: 280,
        }}>
          <Search size={16} color="var(--sub)" />
          <span style={{ font: '500 13px Archivo', color: 'var(--sub)' }}>Buscar carrera…</span>
        </div>

        <span style={{ font: '500 12px Archivo', color: 'var(--muted)' }}>Tipo:</span>
        {FILTROS_TIPO.map(f => (
          <Pill key={f} active={filtroTipo === f} onClick={() => setFiltroTipo(f)}>
            {f}
          </Pill>
        ))}

        <span style={{ font: '500 12px Archivo', color: 'var(--muted)', marginLeft: 4 }}>Costo:</span>
        {FILTROS_COSTO.map(f => (
          <Pill key={f} active={filtroCosto === f} onClick={() => setFiltroCosto(f)}>
            {f === 'Todos' ? 'Todos' : COSTO_LABEL[f]}
          </Pill>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '24px 36px 36px' }}>

        {/* Banners incompletos */}
        {data && (data.sin_perfil_financiero || data.sin_perfil_vocacional) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {data.sin_perfil_financiero && (
              <BannerAlert type="warn">
                <p style={{ font: '700 13px Archivo', color: '#B7791F', marginBottom: 4 }}>Completa tu perfil financiero</p>
                <p style={{ font: '500 12px Archivo', color: '#92400E' }}>
                  Sin este dato, las recomendaciones usan valores predeterminados.
                </p>
                <Link to="/modulos/financiero" style={{
                  display: 'inline-block', marginTop: 10,
                  font: '700 12px Archivo', color: '#fff',
                  background: '#B7791F', padding: '8px 14px', borderRadius: 9,
                  textDecoration: 'none',
                }}>Completar ahora</Link>
              </BannerAlert>
            )}
            {data.sin_perfil_vocacional && (
              <BannerAlert type="info">
                <p style={{ font: '700 13px Archivo', color: 'var(--cyandk)', marginBottom: 4 }}>Completa el test vocacional</p>
                <p style={{ font: '500 12px Archivo', color: 'var(--muted)' }}>
                  El test RIASEC nos permite saber qué programas se alinean con tu perfil.
                </p>
                <Link to="/modulos/test" style={{
                  display: 'inline-block', marginTop: 10,
                  font: '700 12px Archivo', color: '#fff',
                  background: 'var(--cyan)', padding: '8px 14px', borderRadius: 9,
                  textDecoration: 'none',
                }}>Hacer el test</Link>
              </BannerAlert>
            )}
          </div>
        )}

        {/* Resumen del perfil */}
        {data && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
            {cap && (
              <div style={{ background: 'var(--surf)', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ font: '500 12px Archivo', color: 'var(--muted)', marginBottom: 8 }}>Capacidad económica</div>
                <div style={{ font: '800 17px Archivo', color: 'var(--text)', marginBottom: 10 }}>{cap.label}</div>
                <div style={{ height: 6, background: 'var(--line)', borderRadius: 99 }}>
                  <div style={{ width: `${cap.pct}%`, height: '100%', background: cap.bar, borderRadius: 99 }} />
                </div>
              </div>
            )}

            {data.top_rasgos?.length > 0 && (
              <div style={{ background: 'var(--surf)', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ font: '500 12px Archivo', color: 'var(--muted)', marginBottom: 10 }}>Perfil vocacional (top 3)</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {data.top_rasgos.map(r => (
                    <span key={r} style={{
                      font: '600 12px Archivo', padding: '5px 10px', borderRadius: 8,
                      background: 'rgba(21,166,204,.1)', color: 'var(--cyandk)',
                    }}>
                      {RASGO_NOMBRE[r] || r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: 'var(--surf)', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 20px' }}>
              <div style={{ font: '500 12px Archivo', color: 'var(--muted)', marginBottom: 8 }}>Modalidad recomendada</div>
              <div style={{ font: '800 15px Archivo', color: 'var(--text)', marginBottom: 5 }}>
                {MODALIDAD_LABEL[data.modalidad_recomendada] || 'Presencial'}
              </div>
              {data.elegible_subsidios && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, font: '500 12px Archivo', color: 'var(--greendk)' }}>
                  <CheckCircle2 size={13} />
                  Elegible para subsidios
                </div>
              )}
            </div>
          </div>
        )}

        {/* Becas banner */}
        {data?.becas?.length > 0 && (
          <div style={{
            background: 'rgba(134,224,90,.08)', border: '1px solid rgba(134,224,90,.3)',
            borderRadius: 14, padding: '14px 20px', marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ font: '800 11px Archivo', color: '#fff', background: 'var(--lime)', padding: '3px 8px', borderRadius: 6 }}>
                BECAS
              </span>
              <span style={{ font: '700 14px Archivo', color: 'var(--text)' }}>
                Apoyos disponibles para ti
              </span>
            </div>
            <button
              onClick={() => setMostrarBecas(v => !v)}
              style={{ font: '700 13px Archivo', color: 'var(--greendk)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {mostrarBecas ? 'Ocultar' : `Ver ${data.becas.length}`}
            </button>
          </div>
        )}
        {mostrarBecas && data?.becas?.length > 0 && (
          <div style={{ marginBottom: 24, padding: '0 4px' }}>
            {data.becas.map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--line)', font: '500 13px Archivo', color: 'var(--text)' }}>
                <span style={{ color: 'var(--lime)', marginTop: 2 }}>•</span>{b}
              </div>
            ))}
          </div>
        )}

        {/* Programas */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ font: '800 17px Archivo', color: 'var(--text)' }}>
            Programas recomendados
            <span style={{ font: '500 13px Archivo', color: 'var(--muted)', marginLeft: 8 }}>
              ({programasFiltrados.length} resultado{programasFiltrados.length !== 1 ? 's' : ''})
            </span>
          </div>
        </div>

        {!data ? (
          <div style={{
            background: 'var(--surf)', border: '1px solid var(--line)',
            borderRadius: 16, padding: '60px 24px', textAlign: 'center',
          }}>
            <ClipboardList size={40} color="var(--line)" style={{ margin: '0 auto 16px' }} />
            <p style={{ font: '600 15px Archivo', color: 'var(--muted)', marginBottom: 20 }}>
              Para ver recomendaciones personalizadas, completa tus perfiles.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/modulos/financiero" className="btn-primary">Completar perfil financiero</Link>
              <Link to="/modulos/test" className="btn-secondary">Hacer test vocacional</Link>
            </div>
          </div>
        ) : programasFiltrados.length === 0 ? (
          <div style={{
            background: 'var(--surf)', border: '1px solid var(--line)',
            borderRadius: 16, padding: '48px 24px', textAlign: 'center',
          }}>
            <Search size={36} color="var(--line)" style={{ margin: '0 auto 12px' }} />
            <p style={{ font: '600 14px Archivo', color: 'var(--muted)', marginBottom: 12 }}>
              No hay programas con los filtros seleccionados.
            </p>
            <button
              onClick={() => { setFiltroTipo('Todos'); setFiltroCosto('Todos') }}
              style={{ font: '700 13px Archivo', color: 'var(--cyandk)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {programasFiltrados.map((p, i) => (
              <ProgramaCard key={i} prog={p} onVerDetalle={handleVerDetalle} />
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Modal detalle */}
    {progSeleccionado && (
      <ModalDetalle prog={progSeleccionado} onClose={handleCerrarModal} />
    )}
    </>
  )
}
