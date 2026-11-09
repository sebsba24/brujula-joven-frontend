import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { guardarPerfilFinanciero, getPerfilFinanciero, eliminarPerfilFinanciero } from '../../services/api'
import ConfirmModal from '../../components/ui/ConfirmModal'
import { Wallet, CheckCircle2, XCircle, BookOpen, PiggyBank, CreditCard, GraduationCap, TrendingUp, AlertCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

// ==================== EDUCACIÓN FINANCIERA ====================

const TEMAS = [
  {
    id: 'presupuesto',
    icon: TrendingUp,
    color: '#2563eb',
    bgColor: 'rgba(37,99,235,.08)',
    titulo: 'Cómo hacer tu presupuesto personal',
    resumen: 'La regla 50/30/20 adaptada a jóvenes colombianos.',
    contenido: [
      {
        subtitulo: 'La regla 50/30/20',
        texto: 'Divide tus ingresos en tres grandes grupos: el 50% para necesidades básicas (arriendo, alimentación, transporte), el 30% para gustos personales (salidas, ropa, entretenimiento) y el 20% para ahorro o pago de deudas. Si ganas 1 SMMLV ($1.423.500 en 2025), tu meta de ahorro mensual sería ~$284.700.',
      },
      {
        subtitulo: 'Paso 1 — Anota todos tus ingresos',
        texto: 'Incluye todo: sueldo, mesada, ventas ocasionales, transferencias familiares. Sé honesto; si el ingreso varía, usa el promedio de los últimos 3 meses.',
      },
      {
        subtitulo: 'Paso 2 — Lista tus gastos fijos',
        texto: 'Servicios públicos, arriendo o cuota de vivienda, transporte al trabajo o estudio, alimentación básica. Estos no puedes eliminar, solo reducir.',
      },
      {
        subtitulo: 'Paso 3 — Controla los gastos variables',
        texto: 'Domicilios, ropa, planes de celular, suscripciones de streaming. Revisa cuáles puedes recortar sin afectar tu bienestar. Un café diario en tienda puede costar ~$150.000 al mes.',
      },
      {
        subtitulo: 'Herramienta gratuita',
        texto: 'La Superfinanciera tiene una hoja de presupuesto descargable en educacionfinanciera.gov.co — úsala como plantilla.',
        url: 'https://educacionfinanciera.gov.co/',
        urlLabel: 'Ir a educacionfinanciera.gov.co',
      },
    ],
  },
  {
    id: 'ahorro',
    icon: PiggyBank,
    color: '#16a34a',
    bgColor: 'rgba(22,163,74,.08)',
    titulo: 'Cómo empezar a ahorrar desde joven',
    resumen: 'Fondos de emergencia, metas de corto plazo y el poder del interés compuesto.',
    contenido: [
      {
        subtitulo: 'Fondo de emergencia primero',
        texto: 'Antes de pensar en invertir, acumula entre 3 y 6 meses de tus gastos básicos en una cuenta de ahorros separada. Ese colchón te protege si pierdes el empleo o tienes un gasto inesperado.',
      },
      {
        subtitulo: 'Cuenta de ahorros vs. CDT',
        texto: 'Una cuenta de ahorros da liquidez inmediata pero baja tasa (~0.5% E.A.). Un CDT (Certificado de Depósito a Término) te rinde más (~10-12% E.A. en 2025) pero el dinero queda "bloqueado" por el plazo acordado. Si puedes esperar 90 días, un CDT es mejor opción.',
      },
      {
        subtitulo: 'El poder del interés compuesto',
        texto: 'Si ahorras $100.000 al mes desde los 18 años con un rendimiento del 8% anual, a los 30 años tendrías aproximadamente $2.3 millones. Si empiezas a los 25, tendrías solo $900.000. Empezar temprano importa más que el monto.',
      },
      {
        subtitulo: 'Truco: págate a ti primero',
        texto: 'Apenas recibas tu ingreso, transfiere de inmediato el 20% a tu cuenta de ahorro. No esperes a ver "lo que sobra" — casi nunca sobra nada.',
      },
      {
        subtitulo: 'Programas de ahorro en Colombia',
        texto: 'Nubank, Nequi y Daviplata ofrecen "alcancías virtuales" con tasas competitivas y sin cuota de manejo. Son ideales como primer paso para jóvenes.',
      },
    ],
  },
  {
    id: 'credito',
    icon: CreditCard,
    color: '#7c3aed',
    bgColor: 'rgba(124,58,237,.08)',
    titulo: 'Crédito: cuándo usarlo y cuándo evitarlo',
    resumen: 'Tarjetas, créditos de consumo y cómo no caer en deudas.',
    contenido: [
      {
        subtitulo: '¿Qué es la tasa de usura?',
        texto: 'En Colombia, la Superfinanciera fija cada mes la tasa máxima legal de interés (usura). Para el 2025 ronda el 40% E.A. Ningún banco ni financiera puede cobrarte más. Si alguien lo hace, es ilegal.',
      },
      {
        subtitulo: 'Tarjeta de crédito: herramienta, no ingreso',
        texto: 'Una tarjeta de crédito NO es un aumento de sueldo. Solo úsala si puedes pagar el 100% del saldo cada mes para evitar intereses. Pagar solo el "mínimo" es la trampa más común: la deuda crece por el interés compuesto.',
      },
      {
        subtitulo: 'Crédito de libre inversión',
        texto: 'Son préstamos con plazos de 12 a 60 meses. Antes de aceptar uno, calcula el costo total: capital + intereses + seguros. Una deuda de $5 millones al 30% E.A. a 24 meses te cuesta en realidad ~$7.1 millones.',
      },
      {
        subtitulo: 'Historial crediticio (DataCrédito)',
        texto: 'Desde tu primer crédito o servicio postpago, quedas registrado en centrales de riesgo. Pagar a tiempo construye un buen historial, que luego te abre puertas para créditos educativos, vivienda y vehículo con mejores tasas.',
      },
      {
        subtitulo: 'Señales de alerta de "gota a gota"',
        texto: 'Los préstamos informales o "gota a gota" cobran entre 10% y 20% SEMANAL — eso equivale a más del 1.000% anual. Nunca son una solución; siempre empeoran la situación.',
      },
    ],
  },
  {
    id: 'icetex',
    icon: GraduationCap,
    color: '#0891b2',
    bgColor: 'rgba(8,145,178,.08)',
    titulo: 'ICETEX y créditos educativos',
    resumen: 'Cómo funciona el crédito ICETEX, requisitos y cuánto pagarás.',
    contenido: [
      {
        subtitulo: '¿Qué es el ICETEX?',
        texto: 'El Instituto Colombiano de Crédito Educativo y Estudios Técnicos en el Exterior ofrece créditos con tasas subsidiadas para estudiar en instituciones de educación superior acreditadas en Colombia. No es una beca; hay que devolverlo, pero en condiciones mucho más favorables que un banco.',
      },
      {
        subtitulo: 'Modalidades principales',
        texto: '• Crédito largo plazo: pagas mientras estudias solo los intereses (desde $87.000/mes) y el capital al graduarte. • Crédito corto plazo: cuotas fijas durante el estudio. • Tú Eliges: más flexible, pago tras grado.',
      },
      {
        subtitulo: '¿Cuánto te pueden prestar?',
        texto: 'Hasta el 100% del valor de la matrícula según tu situación socioeconómica. Para estratos 1 y 2 hay líneas con tasa del 0% real (solo inflación). Consulta el simulador en icetex.gov.co.',
        url: 'https://www.icetex.gov.co/portal/Inicio/PortalEstudiante/Simulador',
        urlLabel: 'Simulador ICETEX',
      },
      {
        subtitulo: 'Requisito clave: rendimiento académico',
        texto: 'Para mantener el crédito debes aprobar al menos el 80% de las materias inscritas cada semestre. Si repruebas más del 20%, el crédito se suspende temporalmente.',
      },
      {
        subtitulo: 'Beca Generación E',
        texto: 'Si eres de estrato 1, 2 o 3, puedes aplicar a Generación E: el gobierno paga el 100% de tu matrícula en universidades públicas. No es un crédito — no lo devuelves. Aplica a través del ICETEX cada semestre.',
        url: 'https://www.icetex.gov.co/portal/Inicio/PortalEstudiante/Becas',
        urlLabel: 'Ver becas ICETEX',
      },
    ],
  },
  {
    id: 'primer-sueldo',
    icon: Wallet,
    color: '#d97706',
    bgColor: 'rgba(217,119,6,.08)',
    titulo: 'Qué pasa con tu primer sueldo',
    resumen: 'Descuentos de nómina, prestaciones y cómo leer tu desprendible de pago.',
    contenido: [
      {
        subtitulo: 'Descuentos obligatorios de nómina',
        texto: 'De tu salario bruto se descuentan: Salud (4%), Pensión (4%), Fondo de Solidaridad Pensional (si ganas más de 4 SMMLV). En total, el trabajador aporta el 8% de su salario. El empleador aporta aproximadamente el 21% adicional sobre tu salario.',
      },
      {
        subtitulo: 'Prestaciones sociales',
        texto: 'Si tienes contrato formal, la empresa debe pagarte: Prima de servicios (un salario en junio y otro en diciembre), Cesantías (1 mes de salario por año trabajado), Vacaciones (15 días hábiles por año) e Intereses sobre cesantías (12% anual sobre las cesantías).',
      },
      {
        subtitulo: '¿Contrato a término fijo o indefinido?',
        texto: 'El contrato a término fijo puede renovarse indefinidamente, pero te da seguridad por el plazo pactado. El indefinido es más estable a largo plazo; el empleador debe pagarte indemnización si te despide sin justa causa. Ambos dan las mismas prestaciones.',
      },
      {
        subtitulo: 'Salario emocional vs. salario real',
        texto: 'Beneficios como horario flexible, trabajo remoto, auxilio de estudio o alimentación pueden valer más que un aumento nominal. Al evaluar una oferta, suma el valor de todos los beneficios al salario base.',
      },
      {
        subtitulo: 'Declaración de renta',
        texto: 'Si ganas más de 46.8 millones al año (~3.9M/mes) o tienes ingresos de múltiples fuentes, probablemente debas presentar declaración de renta ante la DIAN en julio. Guarda tus certificados de ingresos y retenciones.',
      },
    ],
  },
]

function TarjetaTema({ tema }) {
  const [abierto, setAbierto] = useState(false)
  const Icon = tema.icon

  return (
    <div style={{
      border: '1px solid var(--border, #e5e7eb)',
      borderRadius: 14,
      overflow: 'hidden',
      background: 'var(--bg, #fff)',
    }}>
      {/* Header clickable */}
      <button
        onClick={() => setAbierto(v => !v)}
        style={{
          width: '100%', textAlign: 'left',
          padding: '18px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
          background: 'none', border: 'none', cursor: 'pointer',
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: tema.bgColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={tema.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg, #111827)', marginBottom: 2 }}>
            {tema.titulo}
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted, #6b7280)' }}>
            {tema.resumen}
          </div>
        </div>
        <div style={{ flexShrink: 0, color: 'var(--fg-muted, #6b7280)' }}>
          {abierto ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Contenido expandible */}
      {abierto && (
        <div style={{
          borderTop: '1px solid var(--border, #e5e7eb)',
          padding: '20px 20px 24px',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          {tema.contenido.map((bloque, i) => (
            <div key={i}>
              <div style={{
                fontWeight: 700, fontSize: 13, color: tema.color,
                marginBottom: 6,
              }}>
                {bloque.subtitulo}
              </div>
              <p style={{
                fontSize: 13, lineHeight: 1.65,
                color: 'var(--fg, #111827)', margin: 0,
              }}>
                {bloque.texto}
              </p>
              {bloque.url && (
                <a
                  href={bloque.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    marginTop: 8, fontSize: 12, fontWeight: 600,
                    color: tema.color, textDecoration: 'none',
                  }}
                >
                  {bloque.urlLabel} <ExternalLink size={12} />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EducacionFinanciera() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Banner intro */}
      <div style={{
        background: 'rgba(37,99,235,.06)',
        border: '1px solid rgba(37,99,235,.15)',
        borderRadius: 14, padding: '16px 20px',
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <AlertCircle size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 13, color: 'var(--fg, #111827)', margin: 0, lineHeight: 1.6 }}>
          El 68% de los jóvenes colombianos no recibe educación financiera formal.
          Estos 5 temas pueden marcar la diferencia en tu vida económica.
          Haz clic en cada uno para expandirlo.
        </p>
      </div>

      {TEMAS.map(tema => (
        <TarjetaTema key={tema.id} tema={tema} />
      ))}
    </div>
  )
}

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
  { value: 'no',          label: 'No podría pagar',     color: '#c20a00' },
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

function ResultadoPerfil({ perfil, onReintentar, onSolicitarReinicio }) {
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
              {perfil.elegible_subsidios
                ? <span className="flex items-center gap-1 text-lime-600"><CheckCircle2 className="w-4 h-4" />Sí</span>
                : <span className="flex items-center gap-1 text-red-500"><XCircle className="w-4 h-4" />No</span>
              }
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
          <button onClick={onSolicitarReinicio} className="btn-secondary">
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
  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  // Verificar perfil cada vez que el token esté disponible
  useEffect(() => {
    if (!token) return          // token aún no cargado desde localStorage
    if (!user?.sub) { setCargando(false); return }
    setCargando(true)
    getPerfilFinanciero(user.sub)
      .then(data => { setPerfil(data); setCargando(false) })
      .catch(() => { setCargando(false) })
  }, [token])

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

  const handleSolicitarReinicio = () => setModalAbierto(true)

  const handleConfirmarReinicio = async () => {
    setEliminando(true)
    try {
      await eliminarPerfilFinanciero(user.sub)
      setModalAbierto(false)
      reiniciar()
    } catch {
      setModalAbierto(false)
      reiniciar() // si ya no existe en BD, igual dejamos reiniciar
    } finally {
      setEliminando(false)
    }
  }

  const [tabActivo, setTabActivo] = useState('perfil')

  // ── Cargando ──────────────────────────────────────────────
  if (cargando) {
    return (
      <div style={{ padding: '30px 36px', textAlign: 'center', color: 'var(--muted)' }}>
        Cargando perfil financiero…
      </div>
    )
  }

  return (
    <div style={{ padding: '30px 36px', maxWidth: 760, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/modulos" className="hover:text-blue-400">Módulos</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Financiero</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center shrink-0">
          <Wallet className="w-7 h-7 text-lime-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Módulo Financiero</h1>
          <p className="text-gray-400 mt-1">
            {perfil ? 'Tu perfil socioeconómico está registrado.' : 'Cuéntanos tu situación económica para orientarte mejor.'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4,
        borderBottom: '2px solid #e5e7eb',
        marginBottom: 28,
      }}>
        {[
          { id: 'perfil', label: 'Mi Perfil', icon: '👤' },
          { id: 'educacion', label: 'Educación Financiera', icon: '📚' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setTabActivo(tab.id)}
            style={{
              padding: '10px 18px',
              fontWeight: 600,
              fontSize: 14,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: tabActivo === tab.id ? '2px solid #65a30d' : '2px solid transparent',
              color: tabActivo === tab.id ? '#65a30d' : '#6b7280',
              marginBottom: -2,
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'color .15s',
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Educación Financiera */}
      {tabActivo === 'educacion' && <EducacionFinanciera />}

      {/* Tab: Mi Perfil */}
      {tabActivo === 'perfil' && <>

      {/* Modal de confirmación */}
      <ConfirmModal
        open={modalAbierto}
        danger
        title="¿Realizar el formulario nuevamente?"
        message="Tu perfil financiero actual será eliminado permanentemente. Tendrás que completar el formulario de nuevo para obtener nuevas recomendaciones."
        confirmLabel="Sí, eliminar y reiniciar"
        cancelLabel="Cancelar"
        loading={eliminando}
        onConfirm={handleConfirmarReinicio}
        onCancel={() => setModalAbierto(false)}
      />

      {/* ── Resultado (perfil ya guardado) ── */}
      {perfil ? (
        <ResultadoPerfil perfil={perfil} onReintentar={reiniciar} onSolicitarReinicio={handleSolicitarReinicio} />
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

      </>}
    </div>
  )
}
