import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { guardarPerfilFinanciero, getPerfilFinanciero } from '../../services/api'

// ==================== OPCIONES ====================

const INGRESOS_HOGAR = [
  { value: '<1',  label: 'Menos de 1 SMMLV  (menos de $1.4M)' },
  { value: '1-2', label: 'Entre 1 y 2 SMMLV  ($1.4M – $2.8M)' },
  { value: '2-4', label: 'Entre 2 y 4 SMMLV  ($2.8M – $5.6M)' },
  { value: '4+',  label: 'Más de 4 SMMLV  (más de $5.6M)' },
]

const INGRESOS_PROPIOS = [
  { value: 'ninguno', label: 'No tengo ingresos propios' },
  { value: '<1',      label: 'Menos de 1 SMMLV' },
  { value: '1-2',    label: 'Entre 1 y 2 SMMLV' },
  { value: '2+',     label: 'Más de 2 SMMLV' },
]

const DISPONIBILIDAD = [
  { value: 'completo',      label: 'Tiempo completo', desc: 'Puedo estudiar durante el día' },
  { value: 'medio',         label: 'Medio tiempo',    desc: 'Mañanas o tardes libres' },
  { value: 'fines_semana',  label: 'Fines de semana', desc: 'Solo sábados y domingos' },
]

const PAGO_MATRICULA = [
  { value: 'no',          label: 'No podría pagar',     color: 'red' },
  { value: 'parcialmente',label: 'Con beca o ayuda',    color: 'yellow' },
  { value: 'si',          label: 'Sí podría pagar',     color: 'green' },
]

const PERSONAS = ['1', '2', '3', '4', '5+']

// ==================== COMPONENTES REUTILIZABLES ====================

function RadioCard({ name, value, selected, onChange, label, desc }) {
  const active = selected === value
  return (
    <label
      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
        ${active ? 'border-lime-400 bg-lime-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
    >
      <input type="radio" name={name} value={value} checked={active}
        onChange={() => onChange(value)} className="mt-0.5 accent-lime-500" />
      <div>
        <p className={`font-medium text-sm ${active ? 'text-lime-700' : 'text-gray-800'}`}>{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
    </label>
  )
}

function Toggle({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl border-2 border-gray-200 bg-white">
      <div className="min-w-0">
        <p className="font-medium text-sm text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <div
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative flex-none w-11 h-6 rounded-full cursor-pointer transition-colors duration-200
          ${value ? 'bg-lime-400' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200
          ${value ? 'left-6' : 'left-1'}`} />
      </div>
    </div>
  )
}

function EstratoSelector({ value, onChange }) {
  const colors = {
    1: 'bg-red-100 border-red-300 text-red-700',
    2: 'bg-orange-100 border-orange-300 text-orange-700',
    3: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    4: 'bg-lime-100 border-lime-300 text-lime-700',
    5: 'bg-green-100 border-green-300 text-green-700',
    6: 'bg-teal-100 border-teal-300 text-teal-700',
  }
  return (
    <div className="grid grid-cols-6 gap-2">
      {[1, 2, 3, 4, 5, 6].map(n => (
        <button key={n} type="button"
          onClick={() => onChange(n)}
          className={`py-3 rounded-xl border-2 font-bold text-lg transition-all
            ${value === n ? colors[n] + ' border-opacity-100 shadow-sm scale-105' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

// ==================== PANTALLA DE RESULTADO ====================

function ResultadoPerfil({ perfil, onReintentar }) {
  const navigate = useNavigate()

  const capacidadConfig = {
    alta:  { label: 'Alta',  color: 'bg-green-100 text-green-800 border-green-200',  icon: '💚', desc: 'Tienes buenas posibilidades económicas para acceder a diversas instituciones.' },
    media: { label: 'Media', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '💛', desc: 'Puedes acceder a universidades públicas y privadas con apoyo de becas.' },
    baja:  { label: 'Baja',  color: 'bg-red-100 text-red-800 border-red-200',  icon: '🔴', desc: 'El SENA y las becas Generación E son tus mejores alternativas sin costo.' },
  }

  const modalidadLabel = {
    presencial: 'Presencial',
    virtual:    'Virtual o a distancia',
    cualquiera: 'Presencial o virtual',
  }

  const c = capacidadConfig[perfil.capacidad_economica] || capacidadConfig.media

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 text-lg mb-4">Tu perfil socioeconómico</h2>

        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-3 ${c.color}`}>
          <span>{c.icon}</span>
          <span>Capacidad económica: {c.label}</span>
        </div>
        <p className="text-gray-500 text-sm mb-5">{c.desc}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Elegible para subsidios</p>
            <p className="font-bold text-gray-800">
              {perfil.elegible_subsidios ? '✅ Sí' : '❌ No'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Modalidad recomendada</p>
            <p className="font-bold text-gray-800">{modalidadLabel[perfil.modalidad_recomendada] || 'Presencial'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Estrato registrado</p>
            <p className="font-bold text-gray-800">{perfil.estrato}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Ingresos del hogar</p>
            <p className="font-bold text-gray-800">
              {{ '<1': '< 1 SMMLV', '1-2': '1 – 2 SMMLV', '2-4': '2 – 4 SMMLV', '4+': '> 4 SMMLV' }[perfil.ingresos_hogar] || '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="card p-6 bg-lime-50 border-lime-200">
        <h3 className="font-bold text-gray-900 mb-2">Siguiente paso</h3>
        <p className="text-gray-600 text-sm mb-4">
          Con tu perfil financiero listo, ve al módulo de Educación para ver las universidades
          e instituciones que más se ajustan a tus posibilidades y vocación.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => navigate('/modulos/educacion')} className="btn-primary">
            Ver recomendaciones educativas
          </button>
          <button onClick={onReintentar} className="btn-secondary">
            Actualizar perfil
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== PÁGINA PRINCIPAL ====================

const PASOS = ['Tu hogar', 'Tu situación', 'Posibilidades educativas']

const INICIAL = {
  estrato: null,
  personas_hogar: null,
  personas_trabajan: null,
  ingresos_hogar: null,
  trabaja_actualmente: false,
  ingresos_propios: 'ninguno',
  personas_a_cargo: false,
  tiene_deudas: false,
  acceso_internet: false,
  tiene_computador: false,
  disponibilidad_tiempo: null,
  puede_pagar_matricula: null,
  recibe_subsidios: false,
}

export default function FinancieroPage() {
  const { token } = useAuth()
  const user = token ? jwtDecode(token) : null

  const [paso, setPaso] = useState(1)
  const [form, setForm] = useState(INICIAL)
  const [perfil, setPerfil] = useState(null)        // resultado del backend
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  // Al montar: verificar si ya existe un perfil
  useEffect(() => {
    if (!user?.sub) { setCargando(false); return }
    getPerfilFinanciero(user.sub)
      .then(data => { setPerfil(data); setCargando(false) })
      .catch(() => { setCargando(false) })
  }, [])

  const set = (field) => (val) => setForm(prev => ({ ...prev, [field]: val }))

  // Validación por paso
  const puedeAvanzar = () => {
    if (paso === 1) return form.estrato && form.personas_hogar && form.personas_trabajan && form.ingresos_hogar
    if (paso === 2) return true
    if (paso === 3) return form.disponibilidad_tiempo && form.puede_pagar_matricula
    return false
  }

  const handleSiguiente = () => {
    if (paso < 3) { setPaso(p => p + 1); return }
    handleGuardar()
  }

  const handleGuardar = async () => {
    setGuardando(true)
    setError(null)
    try {
      const payload = {
        ...form,
        personas_hogar:    parseInt(form.personas_hogar) || null,
        personas_trabajan: parseInt(form.personas_trabajan) || null,
      }
      const result = await guardarPerfilFinanciero(payload)
      setPerfil({
        ...payload,
        capacidad_economica:  result.capacidad_economica,
        elegible_subsidios:   result.elegible_subsidios,
        modalidad_recomendada: result.modalidad_recomendada,
      })
    } catch (e) {
      setError('No se pudo guardar el perfil. Inténtalo de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  const reiniciar = () => {
    setPerfil(null)
    setForm(INICIAL)
    setPaso(1)
  }

  // ── Cargando ──────────────────────────────────────────────
  if (cargando) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-400">
        Cargando perfil financiero…
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/modulos" className="hover:text-blue-400">Módulos</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Financiero</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center text-3xl shrink-0">💰</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Módulo Financiero</h1>
          <p className="text-gray-400 mt-1">
            {perfil ? 'Tu perfil socioeconómico está registrado.' : 'Cuéntanos tu situación económica para orientarte mejor.'}
          </p>
        </div>
      </div>

      {/* ── Resultado (perfil ya guardado) ── */}
      {perfil ? (
        <ResultadoPerfil perfil={perfil} onReintentar={reiniciar} />
      ) : (
        <>
          {/* Indicador de pasos */}
          <div className="flex items-center gap-2 mb-8">
            {PASOS.map((label, i) => {
              const n = i + 1
              const activo  = n === paso
              const hecho   = n < paso
              return (
                <div key={n} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                    ${hecho  ? 'bg-lime-400 text-white' : activo ? 'bg-navy-900 text-white' : 'bg-gray-200 text-gray-500'}`}
                    style={{ background: hecho ? undefined : activo ? '#062433' : undefined }}
                  >
                    {hecho ? '✓' : n}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${activo ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
                  {i < PASOS.length - 1 && <div className={`flex-1 h-0.5 ${hecho ? 'bg-lime-400' : 'bg-gray-200'}`} />}
                </div>
              )
            })}
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8">
            <div className="bg-lime-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${((paso - 1) / (PASOS.length - 1)) * 100}%` }} />
          </div>

          {/* ══════════ PASO 1: TU HOGAR ══════════ */}
          {paso === 1 && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-900">Tu hogar</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  ¿Cuál es tu estrato socioeconómico?
                </label>
                <EstratoSelector value={form.estrato} onChange={set('estrato')} />
                <p className="text-xs text-gray-400 mt-2">
                  Lo puedes verificar en el recibo de agua, luz o gas de tu hogar.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  ¿Cuántas personas viven en tu hogar (incluyéndote)?
                </label>
                <div className="flex flex-wrap gap-2">
                  {PERSONAS.map(n => (
                    <button key={n} type="button"
                      onClick={() => set('personas_hogar')(n)}
                      className={`w-12 h-12 rounded-xl border-2 font-semibold text-sm transition-all
                        ${form.personas_hogar === n ? 'border-lime-400 bg-lime-50 text-lime-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >{n}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  ¿Cuántas de esas personas tienen algún ingreso o trabajo?
                </label>
                <div className="flex flex-wrap gap-2">
                  {['0', '1', '2', '3', '4+'].map(n => (
                    <button key={n} type="button"
                      onClick={() => set('personas_trabajan')(n)}
                      className={`w-12 h-12 rounded-xl border-2 font-semibold text-sm transition-all
                        ${form.personas_trabajan === n ? 'border-lime-400 bg-lime-50 text-lime-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >{n}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  ¿Cuánto suman aproximadamente los ingresos mensuales de tu hogar?
                </label>
                <div className="space-y-2">
                  {INGRESOS_HOGAR.map(op => (
                    <RadioCard key={op.value} name="ingresos_hogar"
                      value={op.value} selected={form.ingresos_hogar}
                      onChange={set('ingresos_hogar')} label={op.label} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════ PASO 2: TU SITUACIÓN ══════════ */}
          {paso === 2 && (
            <div className="card p-6 space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Tu situación personal</h2>

              <Toggle label="¿Trabajas actualmente?"
                desc="Cualquier tipo de empleo formal o informal"
                value={form.trabaja_actualmente}
                onChange={set('trabaja_actualmente')} />

              {form.trabaja_actualmente && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ¿Cuánto ganas aproximadamente al mes?
                  </label>
                  <div className="space-y-2">
                    {INGRESOS_PROPIOS.filter(o => o.value !== 'ninguno').map(op => (
                      <RadioCard key={op.value} name="ingresos_propios"
                        value={op.value} selected={form.ingresos_propios}
                        onChange={set('ingresos_propios')} label={op.label} />
                    ))}
                  </div>
                </div>
              )}

              <Toggle label="¿Tienes personas a tu cargo?"
                desc="Hijos, padres, hermanos u otras personas que dependan de ti"
                value={form.personas_a_cargo}
                onChange={set('personas_a_cargo')} />

              <Toggle label="¿Tienes deudas o créditos activos?"
                desc="Crédito de consumo, tarjeta, préstamo, etc."
                value={form.tiene_deudas}
                onChange={set('tiene_deudas')} />
            </div>
          )}

          {/* ══════════ PASO 3: POSIBILIDADES EDUCATIVAS ══════════ */}
          {paso === 3 && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-900">Posibilidades educativas</h2>

              <div className="space-y-3">
                <Toggle label="¿Tienes acceso a internet en casa?"
                  desc="Conexión Wi-Fi o datos suficientes para estudiar"
                  value={form.acceso_internet}
                  onChange={set('acceso_internet')} />

                <Toggle label="¿Tienes computador o tablet?"
                  desc="Dispositivo propio o compartido"
                  value={form.tiene_computador}
                  onChange={set('tiene_computador')} />

                <Toggle label="¿Recibes algún subsidio o apoyo del gobierno?"
                  desc="Familias en Acción, Jóvenes en Acción, etc."
                  value={form.recibe_subsidios}
                  onChange={set('recibe_subsidios')} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  ¿Cuánto tiempo podrías dedicar al estudio?
                </label>
                <div className="space-y-2">
                  {DISPONIBILIDAD.map(op => (
                    <RadioCard key={op.value} name="disponibilidad"
                      value={op.value} selected={form.disponibilidad_tiempo}
                      onChange={set('disponibilidad_tiempo')} label={op.label} desc={op.desc} />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  ¿Podrías pagar una matrícula universitaria?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PAGO_MATRICULA.map(op => (
                    <button key={op.value} type="button"
                      onClick={() => set('puede_pagar_matricula')(op.value)}
                      className={`p-4 rounded-xl border-2 text-sm font-semibold text-center transition-all
                        ${form.puede_pagar_matricula === op.value
                          ? 'border-lime-400 bg-lime-50 text-lime-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >{op.label}</button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Navegación */}
          <div className="flex justify-between mt-6">
            {paso > 1 ? (
              <button onClick={() => setPaso(p => p - 1)} className="btn-secondary">
                Atrás
              </button>
            ) : <div />}

            <button
              onClick={handleSiguiente}
              disabled={!puedeAvanzar() || guardando}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {guardando ? 'Guardando…' : paso === 3 ? 'Ver mi perfil' : 'Continuar'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
