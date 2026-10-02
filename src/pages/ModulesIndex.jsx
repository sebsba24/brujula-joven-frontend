import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Compass, Wallet, GraduationCap, Briefcase } from 'lucide-react'

const modules = [
  {
    id: 'test',
    title: 'Test Vocacional',
    Icon: Compass,
    desc: 'Descubre tu perfil RIASEC y entiende hacia dónde apuntan tus habilidades e intereses.',
    accent: 'blue',
    tag: 'Recomendado primero',
  },
  {
    id: 'financiero',
    title: 'Financiero',
    Icon: Wallet,
    desc: 'Conoce tu capacidad económica y accede a becas, créditos y subsidios disponibles para ti.',
    accent: 'lime',
    tag: null,
  },
  {
    id: 'educacion',
    title: 'Educación',
    Icon: GraduationCap,
    desc: 'Programas técnicos, tecnológicos y universitarios recomendados según tu perfil.',
    accent: 'lime',
    tag: null,
  },
  {
    id: 'empleo',
    title: 'Empleo',
    Icon: Briefcase,
    desc: 'Oportunidades laborales, tips para hoja de vida y simulacros de entrevista.',
    accent: 'blue',
    tag: null,
  },
]

const ACCENT = {
  blue: {
    icon: 'bg-blue-50 text-blue-600',
    tag:  'bg-blue-50 text-blue-600',
    bar:  'bg-blue-400',
    hover:'group-hover:text-blue-600',
  },
  lime: {
    icon: 'bg-lime-50 text-lime-600',
    tag:  'bg-lime-50 text-lime-600',
    bar:  'bg-lime-400',
    hover:'group-hover:text-lime-600',
  },
}

export default function ModulesIndex() {
  const { user } = useAuth()
  const nombre = user?.nombre?.split(' ')[0] || 'bienvenido'

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-navy-900 relative overflow-hidden">
        {/* Decorativos */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 opacity-5 rounded-full" />
          <div className="absolute bottom-0 -left-16 w-72 h-72 bg-lime-400 opacity-5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-navy-800 opacity-40 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-lime-400 text-navy-900 text-xs font-bold px-3 py-1.5 rounded-full mb-5">
              🇨🇴 Plataforma Jóvenes Colombia
            </span>
            <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              Hola, {nombre} 👋<br />
              <span className="text-blue-400">tu próximo paso</span>{' '}
              empieza aquí
            </h1>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              Accede a recursos de empleo, educación, asesoría legal y orientación
              financiera diseñados especialmente para jóvenes colombianos.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/modulos/test" className="btn-primary text-sm px-6 py-3">
                Hacer el test vocacional
              </Link>
              <Link to="/perfil" className="btn-secondary text-sm px-6 py-3">
                Ver mi perfil
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 border-t border-navy-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-6 sm:gap-10">
              {[
                { label: 'Módulos disponibles', value: '4' },
                { label: 'Programas académicos', value: '36+' },
                { label: 'Becas referenciadas', value: '12+' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <span className="text-white font-bold text-lg">{s.value}</span>
                  <span className="text-gray-500 text-sm">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MÓDULOS ──────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Módulos disponibles</h2>
            <p className="text-gray-400 text-sm mt-0.5">Explora cada área a tu ritmo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map(mod => {
            const ac = ACCENT[mod.accent]
            return (
              <Link
                key={mod.id}
                to={`/modulos/${mod.id}`}
                className="card p-6 flex flex-col gap-4 group cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${ac.icon}`}>
                    <mod.Icon className="w-6 h-6" />
                  </div>
                  {mod.tag && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${ac.tag}`}>
                      {mod.tag}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex-1">
                  <h3 className={`font-bold text-gray-900 text-base mb-1.5 transition-colors ${ac.hover}`}>
                    {mod.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{mod.desc}</p>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-400 group-hover:text-gray-700 transition-colors">
                  Explorar
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── RUTA SUGERIDA ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-navy-900 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1">
            <p className="text-lime-400 text-xs font-bold uppercase tracking-wider mb-2">Ruta recomendada</p>
            <h3 className="text-white font-bold text-lg mb-1">
              Empieza por el test vocacional
            </h3>
            <p className="text-gray-400 text-sm">
              Completar el test RIASEC y el perfil financiero activa recomendaciones
              personalizadas en el módulo de Educación.
            </p>
          </div>
          <div className="flex gap-3 shrink-0 flex-wrap">
            <Link to="/modulos/test"       className="btn-primary  text-sm">Hacer test</Link>
            <Link to="/modulos/financiero" className="btn-secondary text-sm">Perfil financiero</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
