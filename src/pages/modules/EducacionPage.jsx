import { Link } from 'react-router-dom'

const programas = [
  { nombre: 'Ingeniería de Sistemas', inst: 'UNAL', tipo: 'Universitario', beca: true, ciudad: 'Bogotá' },
  { nombre: 'Desarrollo de Software', inst: 'SENA', tipo: 'Técnico', beca: true, ciudad: 'Nacional' },
  { nombre: 'Diseño Gráfico',         inst: 'Politécnico', tipo: 'Tecnológico', beca: false, ciudad: 'Medellín' },
  { nombre: 'Administración de Empresas', inst: 'Uniminuto', tipo: 'Universitario', beca: true, ciudad: 'Bogotá' },
]

export default function EducacionPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/modulos" className="hover:text-blue-400">Módulos</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Educación</span>
      </div>

      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center text-3xl shrink-0">🎓</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Módulo de Educación</h1>
          <p className="text-gray-400 mt-1">Becas, programas académicos y rutas de formación disponibles para ti.</p>
        </div>
      </div>

      {/* Banner beca */}
      <div className="bg-lime-50 border border-lime-200 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <span className="text-xs font-bold bg-lime-400 text-navy-900 px-2 py-0.5 rounded-full">NUEVO</span>
          <h3 className="font-bold text-gray-900 mt-2">Beca Generación E — Convocatoria 2025</h3>
          <p className="text-gray-500 text-sm mt-1">Cubre el 100% de matrícula en universidades públicas para estratos 1, 2 y 3.</p>
        </div>
        <button className="btn-primary shrink-0">Ver requisitos</button>
      </div>

      <h2 className="font-bold text-gray-900 text-lg mb-4">Programas destacados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {programas.map((p, i) => (
          <div key={i} className="card p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{p.nombre}</h3>
                <p className="text-gray-500 text-sm">{p.inst} · {p.ciudad}</p>
              </div>
              {p.beca && (
                <span className="text-xs bg-lime-100 text-lime-800 px-2 py-0.5 rounded-full font-semibold shrink-0 ml-2">
                  Con beca
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{p.tipo}</span>
              <button className="btn-secondary text-xs px-3 py-1.5">Ver programa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}