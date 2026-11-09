import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, BookOpen, Building2, CheckCircle2, ExternalLink, Search, MapPin, Clock, Sparkles, AlertCircle } from 'lucide-react'
import { getProgresoEmpleo, guardarProgresoEmpleo, getPerfilByUsuario } from '../../services/api'

// ─── Ofertas por rasgo RIASEC ─────────────────────────────────────────────────
const OFERTAS_POR_RASGO = {
  R: [
    { titulo: 'Técnico en Mantenimiento Eléctrico', sector: 'Manufactura / Industria', modalidad: 'Presencial', experiencia: 'Sin experiencia', salario: '$1.5M – $2.2M', busqueda: 'técnico eléctrico', portal: 'computrabajo' },
    { titulo: 'Operador de Maquinaria Industrial', sector: 'Industria / Producción', modalidad: 'Presencial', experiencia: '6 meses', salario: '$1.4M – $1.9M', busqueda: 'operador maquinaria', portal: 'computrabajo' },
    { titulo: 'Técnico en Sistemas e Informática', sector: 'Tecnología / Soporte TI', modalidad: 'Híbrido', experiencia: 'Sin experiencia', salario: '$1.5M – $2.5M', busqueda: 'técnico sistemas soporte', portal: 'computrabajo' },
    { titulo: 'Instalador de Redes y Cableado', sector: 'Telecomunicaciones', modalidad: 'Presencial', experiencia: '6 meses', salario: '$1.4M – $2.0M', busqueda: 'instalador redes telecomunicaciones', portal: 'computrabajo' },
    { titulo: 'Mecánico de Motos y Vehículos', sector: 'Automotriz', modalidad: 'Presencial', experiencia: '1 año', salario: '$1.6M – $2.4M', busqueda: 'mecánico motos vehículos', portal: 'elempleo' },
    { titulo: 'Auxiliar de Construcción', sector: 'Construcción / Obras Civiles', modalidad: 'Presencial', experiencia: 'Sin experiencia', salario: '$1.3M – $1.6M', busqueda: 'auxiliar construcción obras civiles', portal: 'elempleo' },
  ],
  I: [
    { titulo: 'Analista de Datos Junior', sector: 'Tecnología / Data', modalidad: 'Remoto', experiencia: 'Sin experiencia', salario: '$2.0M – $3.5M', busqueda: 'analista datos junior', portal: 'linkedin' },
    { titulo: 'Desarrollador de Software Junior', sector: 'Desarrollo de Software', modalidad: 'Remoto / Híbrido', experiencia: 'Sin experiencia', salario: '$2.5M – $4.0M', busqueda: 'desarrollador software junior', portal: 'computrabajo' },
    { titulo: 'Auxiliar de Laboratorio', sector: 'Salud / Ciencias', modalidad: 'Presencial', experiencia: 'Estudiante', salario: '$1.4M – $1.9M', busqueda: 'auxiliar laboratorio clínico', portal: 'elempleo' },
    { titulo: 'Analista de Calidad e Investigación', sector: 'Calidad / Procesos', modalidad: 'Presencial', experiencia: '6 meses', salario: '$1.8M – $2.8M', busqueda: 'analista calidad investigación', portal: 'computrabajo' },
    { titulo: 'QA Tester / Analista de Pruebas', sector: 'Tecnología / QA', modalidad: 'Remoto', experiencia: 'Sin experiencia', salario: '$2.0M – $3.0M', busqueda: 'QA tester analista pruebas software', portal: 'linkedin' },
    { titulo: 'Auxiliar de Investigación Académica', sector: 'Educación / Investigación', modalidad: 'Presencial', experiencia: 'Estudiante', salario: '$1.2M – $1.8M', busqueda: 'auxiliar investigación universidad', portal: 'elempleo' },
  ],
  A: [
    { titulo: 'Diseñador Gráfico Junior', sector: 'Diseño / Agencia', modalidad: 'Remoto / Híbrido', experiencia: 'Sin experiencia', salario: '$1.5M – $2.5M', busqueda: 'diseñador gráfico junior', portal: 'computrabajo' },
    { titulo: 'Community Manager', sector: 'Marketing Digital / Redes', modalidad: 'Remoto', experiencia: 'Sin experiencia', salario: '$1.4M – $2.2M', busqueda: 'community manager redes sociales', portal: 'linkedin' },
    { titulo: 'Editor de Video y Contenido Digital', sector: 'Medios / Producción', modalidad: 'Remoto', experiencia: '6 meses', salario: '$1.5M – $2.8M', busqueda: 'editor video contenido digital', portal: 'computrabajo' },
    { titulo: 'Diseñador UX/UI Junior', sector: 'Tecnología / Diseño', modalidad: 'Remoto', experiencia: 'Sin experiencia', salario: '$2.0M – $3.5M', busqueda: 'diseñador UX UI junior', portal: 'linkedin' },
    { titulo: 'Fotógrafo y Creador de Contenido', sector: 'Publicidad / Medios', modalidad: 'Freelance', experiencia: 'Sin experiencia', salario: '$1.2M – $2.0M', busqueda: 'fotógrafo creador contenido Colombia', portal: 'computrabajo' },
    { titulo: 'Redactor / Copywriter', sector: 'Marketing / Publicidad', modalidad: 'Remoto', experiencia: 'Sin experiencia', salario: '$1.3M – $2.2M', busqueda: 'redactor copywriter contenido', portal: 'elempleo' },
  ],
  S: [
    { titulo: 'Auxiliar Pedagógico / Docente de Apoyo', sector: 'Educación', modalidad: 'Presencial', experiencia: 'Estudiante', salario: '$1.3M – $1.8M', busqueda: 'auxiliar pedagógico docente apoyo', portal: 'elempleo' },
    { titulo: 'Asesor de Servicio al Cliente', sector: 'Servicio / Call Center', modalidad: 'Presencial / Remoto', experiencia: 'Sin experiencia', salario: '$1.3M – $1.8M', busqueda: 'asesor servicio al cliente', portal: 'computrabajo' },
    { titulo: 'Promotor Social / Gestor Comunitario', sector: 'ONG / Sector Público', modalidad: 'Presencial', experiencia: 'Sin experiencia', salario: '$1.4M – $2.0M', busqueda: 'promotor social gestor comunitario', portal: 'elempleo' },
    { titulo: 'Auxiliar de Enfermería', sector: 'Salud / Hospital', modalidad: 'Presencial', experiencia: 'Técnico SENA', salario: '$1.4M – $2.0M', busqueda: 'auxiliar enfermería clínica hospital', portal: 'computrabajo' },
    { titulo: 'Psicólogo Junior / Pasante', sector: 'Salud Mental / Bienestar', modalidad: 'Presencial', experiencia: 'Estudiante', salario: '$1.2M – $1.8M', busqueda: 'psicólogo junior pasante', portal: 'elempleo' },
    { titulo: 'Orientador Vocacional / Consejero', sector: 'Educación / Bienestar', modalidad: 'Presencial', experiencia: '6 meses', salario: '$1.5M – $2.2M', busqueda: 'orientador vocacional consejero educativo', portal: 'elempleo' },
  ],
  E: [
    { titulo: 'Asesor Comercial / Ventas', sector: 'Ventas / Comercial', modalidad: 'Presencial / Híbrido', experiencia: 'Sin experiencia', salario: '$1.3M + comisiones', busqueda: 'asesor comercial ventas', portal: 'computrabajo' },
    { titulo: 'Ejecutivo de Cuenta Junior', sector: 'Finanzas / Banca', modalidad: 'Presencial', experiencia: '6 meses', salario: '$1.8M – $2.8M', busqueda: 'ejecutivo cuenta junior banco', portal: 'computrabajo' },
    { titulo: 'Representante de Marketing Digital', sector: 'Marketing / Agencia', modalidad: 'Remoto', experiencia: 'Sin experiencia', salario: '$1.4M – $2.5M', busqueda: 'representante marketing digital agencia', portal: 'linkedin' },
    { titulo: 'Coordinador de Eventos', sector: 'Eventos / Entretenimiento', modalidad: 'Presencial', experiencia: '1 año', salario: '$1.5M – $2.5M', busqueda: 'coordinador eventos Colombia', portal: 'elempleo' },
    { titulo: 'Emprendedor / Operador de Negocio (Fondo Emprender)', sector: 'Emprendimiento SENA', modalidad: 'Presencial', experiencia: 'Sin experiencia', salario: 'Capital semilla', busqueda: 'fondo emprender SENA Colombia', portal: 'elempleo' },
    { titulo: 'Líder de Equipo / Supervisor Junior', sector: 'Retail / Comercio', modalidad: 'Presencial', experiencia: '1 año', salario: '$1.6M – $2.4M', busqueda: 'supervisor líder equipo retail comercio', portal: 'computrabajo' },
  ],
  C: [
    { titulo: 'Auxiliar Contable', sector: 'Contabilidad / Finanzas', modalidad: 'Presencial', experiencia: 'Sin experiencia', salario: '$1.3M – $1.8M', busqueda: 'auxiliar contable contabilidad', portal: 'computrabajo' },
    { titulo: 'Asistente Administrativo', sector: 'Administración / Oficina', modalidad: 'Presencial / Híbrido', experiencia: 'Sin experiencia', salario: '$1.3M – $1.9M', busqueda: 'asistente administrativo oficina', portal: 'computrabajo' },
    { titulo: 'Analista de Nómina y RRHH', sector: 'Recursos Humanos', modalidad: 'Presencial', experiencia: '6 meses', salario: '$1.6M – $2.5M', busqueda: 'analista nómina recursos humanos', portal: 'elempleo' },
    { titulo: 'Auxiliar de Archivo y Gestión Documental', sector: 'Administración Pública / Empresa', modalidad: 'Presencial', experiencia: 'Sin experiencia', salario: '$1.2M – $1.6M', busqueda: 'auxiliar archivo gestión documental', portal: 'elempleo' },
    { titulo: 'Digitador / Analista de Datos Operativos', sector: 'Operaciones / Back Office', modalidad: 'Presencial / Remoto', experiencia: 'Sin experiencia', salario: '$1.3M – $1.8M', busqueda: 'digitador analista datos operativos', portal: 'computrabajo' },
    { titulo: 'Asistente de Tesorería / Bancario', sector: 'Banca / Finanzas', modalidad: 'Presencial', experiencia: '6 meses', salario: '$1.5M – $2.2M', busqueda: 'asistente tesorería banco finanzas', portal: 'computrabajo' },
  ],
}

const RASGOS_INFO = {
  R: { label: 'Realista', color: '#b45309', bg: 'rgba(180,83,9,.1)', emoji: '🔧' },
  I: { label: 'Investigador', color: '#1d4ed8', bg: 'rgba(29,78,216,.1)', emoji: '🔬' },
  A: { label: 'Artístico', color: '#7c3aed', bg: 'rgba(124,58,237,.1)', emoji: '🎨' },
  S: { label: 'Social', color: '#16a34a', bg: 'rgba(22,163,74,.1)', emoji: '🤝' },
  E: { label: 'Emprendedor', color: '#c20a00', bg: 'rgba(194,10,0,.1)', emoji: '🚀' },
  C: { label: 'Convencional', color: '#0891b2', bg: 'rgba(8,145,178,.1)', emoji: '📋' },
}

const PORTALES_URLS = {
  computrabajo: (q) => `https://www.computrabajo.com.co/trabajo-de-${encodeURIComponent(q.replace(/\s+/g, '-'))}`,
  elempleo: (q) => `https://www.elempleo.com/co/ofertas-empleo/?s=${encodeURIComponent(q)}`,
  linkedin: (q) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(q)}&location=Colombia`,
}

const MODAL_BG = { computrabajo: '#2563eb', elempleo: '#16a34a', linkedin: '#0a66c2' }

function OfertaCard({ oferta, rasgo }) {
  const info = RASGOS_INFO[rasgo] || {}
  const url = PORTALES_URLS[oferta.portal]?.(oferta.busqueda) || '#'
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 14,
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {/* Rasgo badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <h3 style={{ fontWeight: 700, fontSize: 14, color: '#111827', margin: 0, lineHeight: 1.35 }}>
          {oferta.titulo}
        </h3>
        <span style={{
          flexShrink: 0,
          fontSize: 11, fontWeight: 700,
          color: info.color,
          background: info.bg,
          borderRadius: 20,
          padding: '2px 8px',
        }}>
          {info.emoji} {info.label}
        </span>
      </div>

      <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{oferta.sector}</p>

      {/* Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <span style={{ fontSize: 11, background: '#f3f4f6', color: '#374151', borderRadius: 20, padding: '3px 10px' }}>
          <MapPin size={10} style={{ display: 'inline', marginRight: 3 }} />{oferta.modalidad}
        </span>
        <span style={{ fontSize: 11, background: '#f3f4f6', color: '#374151', borderRadius: 20, padding: '3px 10px' }}>
          <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />{oferta.experiencia}
        </span>
        <span style={{ fontSize: 11, background: '#ecfdf5', color: '#059669', borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>
          {oferta.salario}
        </span>
      </div>

      {/* Buscar en portal */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 700,
          color: '#fff',
          background: MODAL_BG[oferta.portal] || '#2563eb',
          borderRadius: 8,
          padding: '7px 14px',
          textDecoration: 'none',
          alignSelf: 'flex-start',
          marginTop: 2,
        }}
      >
        <Search size={12} /> Buscar en {oferta.portal.charAt(0).toUpperCase() + oferta.portal.slice(1)}
        <ExternalLink size={11} />
      </a>
    </div>
  )
}

function TabOfertas({ idUsuario }) {
  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [rasgosActivos, setRasgosActivos] = useState([])

  useEffect(() => {
    if (!idUsuario) { setCargando(false); return }
    getPerfilByUsuario(idUsuario)
      .then(data => {
        setPerfil(data)
        setRasgosActivos(data.top3 || [])
      })
      .catch(() => setError(true))
      .finally(() => setCargando(false))
  }, [idUsuario])

  if (cargando) return (
    <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af', fontSize: 14 }}>
      Cargando ofertas acordes a tu perfil…
    </div>
  )

  if (error || !perfil) return (
    <div style={{
      background: '#fffbeb', border: '1px solid #fde68a',
      borderRadius: 12, padding: '16px 20px',
      display: 'flex', gap: 12, alignItems: 'flex-start',
    }}>
      <AlertCircle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
      <div>
        <p style={{ fontWeight: 700, fontSize: 14, color: '#92400e', margin: '0 0 4px' }}>
          Primero completa el test vocacional
        </p>
        <p style={{ fontSize: 13, color: '#78350f', margin: 0 }}>
          Para ver ofertas personalizadas, necesitamos conocer tu perfil. Completa el cuestionario vocacional y vuelve aquí.
        </p>
        <Link
          to="/modulos/vocacional"
          style={{
            display: 'inline-block', marginTop: 10,
            fontSize: 12, fontWeight: 700,
            color: '#fff', background: '#d97706',
            borderRadius: 8, padding: '6px 14px',
            textDecoration: 'none',
          }}
        >
          Ir al test vocacional →
        </Link>
      </div>
    </div>
  )

  const dominante = perfil.dominante
  const top3 = perfil.top3 || []

  // Construir lista de ofertas para los rasgos activos
  const ofertasMostradas = rasgosActivos.flatMap(r =>
    (OFERTAS_POR_RASGO[r] || []).map(o => ({ ...o, rasgo: r }))
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Banner de perfil */}
      <div style={{
        background: 'rgba(37,99,235,.06)',
        border: '1px solid rgba(37,99,235,.15)',
        borderRadius: 14, padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Sparkles size={18} color="#2563eb" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, fontSize: 13, color: '#111827' }}>
          Mostrando ofertas para tu perfil: {' '}
          {top3.map(r => (
            <span key={r} style={{
              display: 'inline-block',
              background: RASGOS_INFO[r]?.bg,
              color: RASGOS_INFO[r]?.color,
              borderRadius: 20, padding: '1px 8px',
              fontWeight: 700, fontSize: 12,
              margin: '0 3px',
            }}>
              {RASGOS_INFO[r]?.emoji} {RASGOS_INFO[r]?.label}
            </span>
          ))}
        </div>
      </div>

      {/* Filtros por rasgo */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {top3.map(r => {
          const activo = rasgosActivos.includes(r)
          const info = RASGOS_INFO[r]
          return (
            <button
              key={r}
              onClick={() => setRasgosActivos(prev =>
                prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
              )}
              style={{
                fontSize: 12, fontWeight: 700,
                padding: '5px 14px', borderRadius: 20,
                border: `2px solid ${activo ? info.color : '#e5e7eb'}`,
                background: activo ? info.bg : 'transparent',
                color: activo ? info.color : '#6b7280',
                cursor: 'pointer',
              }}
            >
              {info.emoji} {info.label} ({(OFERTAS_POR_RASGO[r] || []).length})
            </button>
          )
        })}
      </div>

      {/* Grid de ofertas */}
      {ofertasMostradas.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
          Selecciona al menos un rasgo para ver ofertas.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {ofertasMostradas.map((o, i) => (
            <OfertaCard key={`${o.rasgo}-${i}`} oferta={o} rasgo={o.rasgo} />
          ))}
        </div>
      )}

      <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 4 }}>
        Las búsquedas se abren en Computrabajo, elempleo.com o LinkedIn Jobs con términos relevantes a tu perfil.
      </p>
    </div>
  )
}

const RECURSOS = [
  {
    id: 'hoja-de-vida',
    title: 'Cómo crear una hoja de vida moderna',
    tipo: 'Guía',
    tiempo: '5 min',
    url: 'https://www.mintrabajo.gov.co/empleo/consejos-para-empleo',
  },
  {
    id: 'entrevistas',
    title: 'Preparación para entrevistas de trabajo',
    tipo: 'Video',
    tiempo: '12 min',
    url: 'https://www.sena.edu.co/es-co/Empresarios/paginas/orientacionEmpresarial.aspx',
  },
  {
    id: 'plataformas',
    title: 'Plataformas de empleo en Colombia',
    tipo: 'Lista',
    tiempo: '3 min',
    url: 'https://www.computrabajo.com.co',
  },
  {
    id: 'contratos',
    title: 'Contratos laborales: qué debes saber',
    tipo: 'Guía',
    tiempo: '8 min',
    url: 'https://www.mintrabajo.gov.co/relaciones-laborales/derechos-fundamentales-del-trabajo',
  },
  {
    id: 'derechos',
    title: 'Primer empleo: derechos y obligaciones',
    tipo: 'Artículo',
    tiempo: '6 min',
    url: 'https://www.mintrabajo.gov.co/empleo/ley-primer-empleo',
  },
]

const PORTALES = [
  {
    nombre: 'Computrabajo',
    descripcion: 'El portal de empleo más grande de Colombia',
    url: 'https://www.computrabajo.com.co',
    color: '#2563eb',
    inicial: 'C',
  },
  {
    nombre: 'LinkedIn Jobs',
    descripcion: 'Red profesional con miles de ofertas en Colombia',
    url: 'https://www.linkedin.com/jobs/',
    color: '#0a66c2',
    inicial: 'Li',
  },
  {
    nombre: 'El Empleo',
    descripcion: 'Portal colombiano especializado en primer empleo',
    url: 'https://www.elempleo.com',
    color: '#16a34a',
    inicial: 'E',
  },
  {
    nombre: 'Magneto',
    descripcion: 'Plataforma con matching inteligente para Colombia',
    url: 'https://www.magneto365.com',
    color: '#7c3aed',
    inicial: 'M',
  },
]

export default function EmpleoPage() {
  const [tab, setTab] = useState('ofertas')
  const [completados, setCompletados] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const idUsuario = user?.id_usuario

  // Cargar progreso del backend
  useEffect(() => {
    if (!idUsuario) { setLoading(false); return }
    getProgresoEmpleo(idUsuario)
      .then(data => setCompletados(new Set(data.recursos_completados || [])))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [idUsuario])

  // Guardar progreso en el backend
  const saveProgress = useCallback(async (nextSet) => {
    if (!idUsuario) return
    setSaving(true)
    try {
      await guardarProgresoEmpleo(idUsuario, Array.from(nextSet))
    } catch {
      // error silencioso — el estado local ya se actualizó
    } finally {
      setSaving(false)
    }
  }, [idUsuario])

  const toggleRecurso = (id) => {
    const next = new Set(completados)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setCompletados(next)
    saveProgress(next)
  }

  const totalCompletados = completados.size
  const total = RECURSOS.length
  const pct = total > 0 ? Math.round((totalCompletados / total) * 100) : 0
  const todoCompleto = totalCompletados === total

  return (
    <div style={{ padding: '30px 36px' }}>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/modulos" className="hover:text-blue-400">Módulos</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Empleo</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
          <Briefcase className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Módulo de Empleo</h1>
          <p className="text-gray-400 mt-1">Recursos para conseguir y mantener tu primer empleo en Colombia.</p>
        </div>
      </div>

      {/* Progress card */}
      <div className="card p-5 mb-6">
        {loading ? (
          <div className="text-sm text-gray-400">Cargando progreso...</div>
        ) : todoCompleto ? (
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-lime-400 shrink-0" />
            <div>
              <p className="font-bold text-gray-900">¡Completaste todos los recursos!</p>
              <p className="text-sm text-gray-400">Explora los portales de empleo para dar el siguiente paso.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Tu progreso</span>
                <span className="text-blue-400 font-bold flex items-center gap-1.5">
                  {pct}%
                  {saving && <span className="text-xs text-gray-400 font-normal">guardando…</span>}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <div className="text-center shrink-0">
              <div className="text-2xl font-bold text-blue-400">{totalCompletados}/{total}</div>
              <div className="text-xs text-gray-400">completados</div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: 'ofertas', label: 'Ofertas para ti', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'recursos', label: 'Recursos', icon: <BookOpen className="w-3.5 h-3.5" /> },
          { id: 'portales', label: 'Portales de empleo', icon: <Building2 className="w-3.5 h-3.5" /> },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`pb-3 px-2 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${
              tab === t.id ? 'border-blue-400 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}>
            <span className="flex items-center gap-1.5">{t.icon}{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: ofertas personalizadas */}
      {tab === 'ofertas' && <TabOfertas idUsuario={idUsuario} />}

      {/* Tab: recursos */}
      {tab === 'recursos' && (
        <div className="space-y-3">
          {RECURSOS.map(r => {
            const done = completados.has(r.id)
            return (
              <div key={r.id} className="card p-4 flex items-center gap-4">
                {/* Checkbox interactivo */}
                <button
                  onClick={() => toggleRecurso(r.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    done ? 'bg-lime-400 border-lime-400' : 'border-gray-300 hover:border-lime-400'
                  }`}
                >
                  {done && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                    </svg>
                  )}
                </button>

                <div className="flex-1">
                  <p className={`font-medium text-sm ${done ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {r.title}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{r.tipo}</span>
                    <span className="text-xs text-gray-400">{r.tiempo}</span>
                  </div>
                </div>

                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 shrink-0"
                >
                  Ver <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )
          })}
        </div>
      )}

      {/* Tab: portales */}
      {tab === 'portales' && (
        <div className="space-y-3">
          {PORTALES.map(p => (
            <div key={p.nombre} className="card p-5 flex items-center gap-4">
              {/* Logo inicial */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: p.color }}
              >
                {p.inicial}
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{p.nombre}</h3>
                <p className="text-gray-500 text-sm">{p.descripcion}</p>
              </div>

              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 shrink-0"
              >
                Ir al portal <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
