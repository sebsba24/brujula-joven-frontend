import { useState } from 'react'
import { Link } from 'react-router-dom'

const tips = [
  { titulo: 'La regla 50/30/20 para tu salario', icon: '📊', nivel: 'Básico' },
  { titulo: 'Cómo abrir tu primera cuenta bancaria', icon: '🏦', nivel: 'Básico' },
  { titulo: 'Crédito de libranza: qué es y cómo funciona', icon: '💳', nivel: 'Intermedio' },
  { titulo: 'Fondos de inversión desde $50.000 COP', icon: '📈', nivel: 'Intermedio' },
]

const niveles = { Básico: 'bg-lime-100 text-lime-800', Intermedio: 'bg-blue-100 text-blue-800' }

export default function FinancieroPage() {
  const [ahorro, setAhorro] = useState(500000)
  const meta = 2000000
  const pct = Math.round((ahorro / meta) * 100)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/modulos" className="hover:text-blue-400">Módulos</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Financiero</span>
      </div>

      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center text-3xl shrink-0">💰</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Módulo Financiero</h1>
          <p className="text-gray-400 mt-1">Aprende a manejar tu dinero y construir tu futuro financiero.</p>
        </div>
      </div>

      {/* Simulador de ahorro */}
      <div className="card p-6 mb-8 bg-navy-900 border-0">
        <h3 className="text-white font-bold text-lg mb-4">Simulador de meta de ahorro</h3>
        <div className="mb-4">
          <label className="text-gray-400 text-sm block mb-2">
            Ahorro actual: <span className="text-lime-400 font-bold">${ahorro.toLocaleString('es-CO')} COP</span>
          </label>
          <input type="range" min={0} max={meta} step={50000} value={ahorro}
            onChange={e => setAhorro(+e.target.value)}
            className="w-full accent-lime-400" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$0</span><span>${meta.toLocaleString('es-CO')}</span>
          </div>
        </div>
        <div className="w-full bg-navy-800 rounded-full h-3 mb-2">
          <div className="bg-lime-400 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-center text-white text-sm">
          <span className="text-lime-400 font-bold text-lg">{pct}%</span> de tu meta alcanzada
        </p>
      </div>

      <h2 className="font-bold text-gray-900 text-lg mb-4">Guías de educación financiera</h2>
      <div className="space-y-3">
        {tips.map((t, i) => (
          <div key={i} className="card p-4 flex items-center gap-4 hover:border-lime-400 cursor-pointer group transition-colors">
            <div className="text-2xl">{t.icon}</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 text-sm group-hover:text-lime-600 transition-colors">{t.titulo}</h3>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${niveles[t.nivel]}`}>{t.nivel}</span>
            <svg className="w-4 h-4 text-gray-300 group-hover:text-lime-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}