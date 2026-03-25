import { Link } from 'react-router-dom'

const modules = [
  {
    id: 'empleo',
    title: 'Empleo',
    icon: '💼',
    desc: 'Encuentra oportunidades laborales, tips para tu hoja de vida y simulacros de entrevista.',
    color: 'blue',
    progress: 45,
  },
  {
    id: 'educacion',
    title: 'Educación',
    icon: '🎓',
    desc: 'Becas, programas técnicos, universidades y rutas de aprendizaje en Colombia.',
    color: 'lime',
    progress: 30,
  },
  {
    id: 'legal',
    title: 'Legal',
    icon: '⚖️',
    desc: 'Conoce tus derechos, subsidios del Estado y procesos jurídicos accesibles.',
    color: 'blue',
    progress: 10,
  },
  {
    id: 'financiero',
    title: 'Financiero',
    icon: '💰',
    desc: 'Educación financiera, ahorro, crédito y cómo acceder al sistema bancario.',
    color: 'lime',
    progress: 60,
  },
]

const colorMap = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-400', bar: 'bg-blue-400', icon: 'bg-blue-100' },
  lime: { bg: 'bg-lime-50', border: 'border-lime-200', badge: 'bg-lime-400', bar: 'bg-lime-400', icon: 'bg-lime-100' },
}

export default function ModulesIndex() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Hero */}
      <div className="bg-navy-900 rounded-3xl p-8 md:p-12 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-lime-400 opacity-10 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <span className="inline-block bg-lime-400 text-navy-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
            Plataforma Jóvenes Colombia
          </span>
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-3">
            Tu próximo paso <span className="text-blue-400">empieza aquí</span>
          </h1>
          <p className="text-gray-400 text-base max-w-xl">
            Accede a recursos de empleo, educación, asesoría legal y educación financiera
            diseñados para jóvenes colombianos.
          </p>
        </div>
      </div>

      {/* Grid de módulos */}
      <h2 className="text-gray-900 font-bold text-xl mb-5">Módulos disponibles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {modules.map(mod => {
          const c = colorMap[mod.color]
          return (
            <Link key={mod.id} to={`/modulos/${mod.id}`}
              className="card p-6 flex flex-col gap-4 group">
              <div className={`w-12 h-12 ${c.icon} rounded-xl flex items-center justify-center text-2xl`}>
                {mod.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">{mod.desc}</p>
              </div>
              <div className="mt-auto">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Progreso</span><span>{mod.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className={`${c.bar} h-1.5 rounded-full transition-all`}
                    style={{ width: `${mod.progress}%` }} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}