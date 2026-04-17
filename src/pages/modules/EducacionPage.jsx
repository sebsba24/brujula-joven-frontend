import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { getRecomendacionesEducacion } from '../../services/api'

// ==================== HELPERS ====================

const TIPO_COLOR = {
  'Técnico':       'bg-blue-100 text-blue-700',
  'Tecnológico':   'bg-purple-100 text-purple-700',
  'Universitario': 'bg-indigo-100 text-indigo-700',
}

const COSTO_LABEL = {
  gratuito: { label: 'Gratuito',  cls: 'bg-green-100 text-green-700' },
  bajo:     { label: 'Costo bajo', cls: 'bg-lime-100 text-lime-700' },
  medio:    { label: 'Costo medio', cls: 'bg-yellow-100 text-yellow-700' },
  alto:     { label: 'Costo alto', cls: 'bg-red-100 text-red-700' },
}

const RASGO_NOMBRE = { R: 'Realista', I: 'Investigador', A: 'Artístico', S: 'Social', E: 'Emprendedor', C: 'Convencional' }
const RASGO_COLOR  = { R: 'bg-orange-100 text-orange-700', I: 'bg-blue-100 text-blue-700', A: 'bg-pink-100 text-pink-700',
                       S: 'bg-teal-100 text-teal-700', E: 'bg-emerald-100 text-emerald-700', C: 'bg-violet-100 text-violet-700' }

const CAPACIDAD_CONFIG = {
  alta:  { label: 'Alta',  icon: '💚', bar: 'bg-green-400',  pct: 90 },
  media: { label: 'Media', icon: '💛', bar: 'bg-yellow-400', pct: 55 },
  baja:  { label: 'Baja',  icon: '🔴', bar: 'bg-red-400',    pct: 25 },
}

const MODALIDAD_LABEL = {
  presencial: 'Presencial',
  virtual:    'Virtual / a distancia',
  cualquiera: 'Presencial o virtual',
}

// ==================== SUBCOMPONENTES ====================

function BannerIncompleto({ sinFinanciero, sinVocacional }) {
  return (
    <div className="space-y-3 mb-8">
      {sinFinanciero && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-amber-800">Completa tu perfil financiero</p>
            <p className="text-amber-700 text-sm mt-1">
              Sin este dato, las recomendaciones usan valores predeterminados. Para resultados precisos, responde el formulario financiero.
            </p>
          </div>
          <Link to="/modulos/financiero" className="btn-primary shrink-0">Completar ahora</Link>
        </div>
      )}
      {sinVocacional && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-blue-800">Completa el test vocacional</p>
            <p className="text-blue-700 text-sm mt-1">
              El test RIASEC nos permite saber qué tipo de programas se alinean mejor con tu perfil.
            </p>
          </div>
          <Link to="/modulos/test" className="btn-secondary shrink-0">Hacer el test</Link>
        </div>
      )}
    </div>
  )
}

function ProgramaCard({ prog }) {
  const costo = COSTO_LABEL[prog.costo] || COSTO_LABEL.medio
  const tipo  = TIPO_COLOR[prog.tipo]   || 'bg-gray-100 text-gray-700'
  const rasgo = RASGO_COLOR[prog.rasgo] || 'bg-gray-100 text-gray-700'

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-bold text-gray-900 text-sm leading-tight">{prog.nombre}</h3>
          <p className="text-gray-500 text-xs mt-0.5">{prog.inst} · {prog.ciudad}</p>
        </div>
        {prog.con_beca && (
          <span className="text-xs bg-lime-100 text-lime-800 px-2 py-0.5 rounded-full font-semibold shrink-0 ml-1">
            Beca disponible
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${tipo}`}>{prog.tipo}</span>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${costo.cls}`}>{costo.label}</span>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${rasgo}`}>{RASGO_NOMBRE[prog.rasgo]}</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {prog.modalidad.map(m => (
          <span key={m} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {MODALIDAD_LABEL[m] || m}
          </span>
        ))}
      </div>
    </div>
  )
}

// ==================== PÁGINA PRINCIPAL ====================

const FILTROS_TIPO = ['Todos', 'Técnico', 'Tecnológico', 'Universitario']
const FILTROS_COSTO = ['Todos', 'gratuito', 'bajo', 'medio', 'alto']

export default function EducacionPage() {
  const { token } = useAuth()
  const user = token ? jwtDecode(token) : null

  const [data, setData]           = useState(null)
  const [cargando, setCargando]   = useState(true)
  const [filtroTipo, setFiltroTipo]   = useState('Todos')
  const [filtroCosto, setFiltroCosto] = useState('Todos')
  const [mostrarBecas, setMostrarBecas] = useState(false)

  useEffect(() => {
    if (!user?.sub) { setCargando(false); return }
    getRecomendacionesEducacion(user.sub)
      .then(res => { setData(res); setCargando(false) })
      .catch(() => { setCargando(false) })
  }, [])

  const programasFiltrados = (data?.programas || []).filter(p => {
    if (filtroTipo  !== 'Todos' && p.tipo  !== filtroTipo)  return false
    if (filtroCosto !== 'Todos' && p.costo !== filtroCosto) return false
    return true
  })

  const cap = data?.capacidad_economica
    ? CAPACIDAD_CONFIG[data.capacidad_economica]
    : null

  if (cargando) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-400">
        Cargando recomendaciones…
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/modulos" className="hover:text-blue-400">Módulos</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Educación</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center text-3xl shrink-0">🎓</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Módulo de Educación</h1>
          <p className="text-gray-400 mt-1">
            Programas académicos e instituciones recomendadas según tu perfil.
          </p>
        </div>
      </div>

      {/* Banners de perfil incompleto */}
      {data && (data.sin_perfil_financiero || data.sin_perfil_vocacional) && (
        <BannerIncompleto sinFinanciero={data.sin_perfil_financiero} sinVocacional={data.sin_perfil_vocacional} />
      )}

      {/* Resumen del perfil */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Capacidad económica */}
          {cap && (
            <div className="card p-5">
              <p className="text-xs text-gray-400 mb-2">Capacidad económica</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{cap.icon}</span>
                <span className="font-bold text-gray-800">{cap.label}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className={`${cap.bar} h-2 rounded-full`} style={{ width: `${cap.pct}%` }} />
              </div>
            </div>
          )}

          {/* Perfil vocacional */}
          <div className="card p-5">
            <p className="text-xs text-gray-400 mb-2">Perfil vocacional (top 3)</p>
            {data.top_rasgos?.length ? (
              <div className="flex flex-wrap gap-2">
                {data.top_rasgos.map(r => (
                  <span key={r} className={`text-xs px-2.5 py-1 rounded-full font-semibold ${RASGO_COLOR[r] || 'bg-gray-100 text-gray-600'}`}>
                    {RASGO_NOMBRE[r] || r}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Sin datos</p>
            )}
          </div>

          {/* Modalidad */}
          <div className="card p-5">
            <p className="text-xs text-gray-400 mb-2">Modalidad recomendada</p>
            <p className="font-bold text-gray-800 text-sm">
              {MODALIDAD_LABEL[data.modalidad_recomendada] || 'Presencial'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {data.elegible_subsidios ? '✅ Elegible para subsidios' : 'Sin elegibilidad de subsidios'}
            </p>
          </div>
        </div>
      )}

      {/* Becas */}
      {data?.becas?.length > 0 && (
        <div className="bg-lime-50 border border-lime-200 rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold bg-lime-400 text-white px-2 py-0.5 rounded-full mr-2">BECAS</span>
              <span className="font-bold text-gray-900">Apoyos disponibles para ti</span>
            </div>
            <button onClick={() => setMostrarBecas(v => !v)}
              className="text-sm text-lime-700 font-medium hover:underline">
              {mostrarBecas ? 'Ocultar' : `Ver ${data.becas.length}`}
            </button>
          </div>
          {mostrarBecas && (
            <ul className="mt-4 space-y-2">
              {data.becas.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-lime-500 mt-0.5 shrink-0">•</span>{b}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div>
          <span className="text-xs text-gray-400 mr-2">Tipo:</span>
          {FILTROS_TIPO.map(f => (
            <button key={f}
              onClick={() => setFiltroTipo(f)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium mr-1.5 transition-colors
                ${filtroTipo === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >{f}</button>
          ))}
        </div>
        <div>
          <span className="text-xs text-gray-400 mr-2">Costo:</span>
          {FILTROS_COSTO.map(f => (
            <button key={f}
              onClick={() => setFiltroCosto(f)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium mr-1.5 transition-colors
                ${filtroCosto === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >{f === 'Todos' ? 'Todos' : COSTO_LABEL[f]?.label || f}</button>
          ))}
        </div>
      </div>

      {/* Programas */}
      <h2 className="font-bold text-gray-900 text-lg mb-4">
        Programas recomendados
        <span className="ml-2 text-sm font-normal text-gray-400">
          ({programasFiltrados.length} resultado{programasFiltrados.length !== 1 ? 's' : ''})
        </span>
      </h2>

      {programasFiltrados.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No hay programas con los filtros seleccionados.</p>
          <button onClick={() => { setFiltroTipo('Todos'); setFiltroCosto('Todos') }}
            className="mt-3 text-sm text-blue-400 hover:underline">Limpiar filtros</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {programasFiltrados.map((p, i) => (
            <ProgramaCard key={i} prog={p} />
          ))}
        </div>
      )}

      {/* Sin datos del todo */}
      {!data && (
        <div className="card p-10 text-center text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium mb-4">Para ver recomendaciones personalizadas, completa primero tus perfiles.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/modulos/financiero" className="btn-primary">Completar perfil financiero</Link>
            <Link to="/modulos/test" className="btn-secondary">Hacer test vocacional</Link>
          </div>
        </div>
      )}
    </div>
  )
}
