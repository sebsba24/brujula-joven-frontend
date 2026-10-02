import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { sendChatMessage } from '../../services/api'
import { Compass, MessageCircle, X, Send } from 'lucide-react'

const WELCOME = {
  role: 'assistant',
  content: '¡Hola! Soy Brújula, tu guía de orientación educativa en NextSteps. Puedo ayudarte con programas universitarios, técnicos, becas y financiamiento. ¿Por dónde empezamos?',
}

function LoadingDots() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1.5 items-center">
        {[0, 150, 300].map(delay => (
          <span
            key={delay}
            className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  )
}


export default function ChatWidget() {
  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  if (!isAuthenticated) return null

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    const history = messages.slice(-10)
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const data = await sendChatMessage(text, history)
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError('No se pudo conectar con Brújula. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-lime-400 text-gray-900 shadow-lg hover:bg-lime-500 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
        aria-label="Abrir chat de ayuda"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-h-[480px] flex flex-col bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-[#1A2E37] px-4 py-3 flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-lime-400" />
                <p className="text-white font-bold text-sm leading-tight">Brújula IA</p>
              </div>
              <p className="text-gray-400 text-xs">Orientación educativa · NextSteps</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Cerrar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-3 space-y-2 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-lime-400 text-gray-900 rounded-2xl rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && <LoadingDots />}

            {error && (
              <p className="text-xs text-red-500 text-center py-1">{error}</p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-200 p-3 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta..."
              disabled={loading}
              className="input flex-1 text-sm py-2 px-3 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="btn-primary px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              aria-label="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
