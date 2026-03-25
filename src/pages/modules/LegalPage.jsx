import { Link } from 'react-router-dom'

const temas = [
  { titulo: 'Derechos laborales básicos en Colombia', icon: '📋', categoria: 'Laboral' },
  { titulo: 'Cómo acceder a la defensoría pública', icon: '🏛️', categoria: 'Civil' },
  { titulo: 'Subsidios del Estado para jóvenes', icon: '🏦', categoria: 'Subsidios' },
  { titulo: 'ICBF: servicios y protección juvenil', icon: '🤝', categoria: 'Protección' },
  { titulo: 'Proceso de denuncias ante la Fiscalía', icon: '📝', categoria: 'Penal' },
  { titulo: 'Registro civil y trámites de identidad', icon: '🪪', categoria: 'Trámites' },
]

export default function LegalPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/modulos" className="hover:text-blue-400">Módulos</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Legal</span>
      </div>

      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl shrink-0">⚖️</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Módulo Legal</h1>
          <p className="text-gray-400 mt-1">Conoce tus derechos y accede a orientación jurídica gratuita.</p>
        </div>
      </div>

      {/* Aviso */}
      <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 mb-8">
        <p className="text-sm text-blue-800">
          <strong>Línea gratuita:</strong> Si necesitas asesoría jurídica urgente, llama a la Defensoría del Pueblo: <strong>900 91 0111</strong>
        </p>
      </div>

      <h2 className="font-bold text-gray-900 text-lg mb-4">Temas principales</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {temas.map((t, i) => (
          <div key={i} className="card p-5 cursor-pointer group hover:border-blue-400 transition-colors">
            <div className="text-2xl mb-3">{t.icon}</div>
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{t.categoria}</span>
            <h3 className="font-semibold text-gray-900 text-sm mt-2 group-hover:text-blue-600 transition-colors">
              {t.titulo}
            </h3>
          </div>
        ))}
      </div>
    </div>
  )
}