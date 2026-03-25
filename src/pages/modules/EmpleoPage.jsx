import { useState } from 'react'
import { Link } from 'react-router-dom'

const recursos = [
  { title: 'Cómo crear una hoja de vida moderna', tipo: 'Guía', tiempo: '5 min', done: true },
  { title: 'Preparación para entrevistas de trabajo', tipo: 'Video', tiempo: '12 min', done: true },
  { title: 'Plataformas de empleo en Colombia', tipo: 'Lista', tiempo: '3 min', done: false },
  { title: 'Contratos laborales: qué debes saber', tipo: 'Guía', tiempo: '8 min', done: false },
  { title: 'Primer empleo: derechos y obligaciones', tipo: 'Artículo', tiempo: '6 min', done: false },
]

const ofertas = [
  { empresa: 'Bancolombia', cargo: 'Analista Junior', ciudad: 'Medellín', tipo: 'Tiempo completo' },
  { empresa: 'Rappi',       cargo: 'Soporte al cliente', ciudad: 'Bogotá', tipo: 'Medio tiempo' },
  { empresa: 'Claro',       cargo: 'Técnico de campo', ciudad: 'Cali', tipo: 'Tiempo completo' },
]

export default function EmpleoPage() {
  const [tab, setTab] = useState('recursos')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/modulos" className="hover:text-blue-400">Módulos</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Empleo</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl shrink-0">💼</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Módulo de Empleo</h1>
          <p className="text-gray-400 mt-1">Recursos para conseguir y mantener tu primer empleo en Colombia.</p>
        </div>
      </div>

      {/* Progress */}
      <div className="card p-5 mb-6 flex items-center gap-5">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">Tu progreso</span>
            <span className="text-blue-400 font-bold">45%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-blue-400 h-2 rounded-full" style={{ width: '45%' }} />
          </div>
        </div>
        <div className="text-center shrink-0">
          <div className="text-2xl font-bold text-blue-400">2/5</div>
          <div className="text-xs text-gray-400">completados</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {['recursos', 'ofertas'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-3 px-2 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${
              tab === t ? 'border-blue-400 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}>
            {t === 'recursos' ? '📚 Recursos' : '🏢 Ofertas de empleo'}
          </button>
        ))}
      </div>

      {tab === 'recursos' && (
        <div className="space-y-3">
          {recursos.map((r, i) => (
            <div key={i} className="card p-4 flex items-center gap-4">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                r.done ? 'bg-lime-400 border-lime-400' : 'border-gray-300'
              }`}>
                {r.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
              </div>
              <div className="flex-1">
                <p className={`font-medium text-sm ${r.done ? 'line-through text-gray-400' : 'text-gray-900'}`}>{r.title}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{r.tipo}</span>
                  <span className="text-xs text-gray-400">{r.tiempo}</span>
                </div>
              </div>
              {!r.done && <button className="btn-secondary text-xs px-3 py-1.5">Ver</button>}
            </div>
          ))}
        </div>
      )}

      {tab === 'ofertas' && (
        <div className="space-y-3">
          {ofertas.map((o, i) => (
            <div key={i} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{o.cargo}</h3>
                <p className="text-gray-500 text-sm">{o.empresa} · {o.ciudad}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-navy-900 text-blue-400 px-3 py-1 rounded-full font-medium">{o.tipo}</span>
                <button className="btn-primary text-xs px-4 py-2">Aplicar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}