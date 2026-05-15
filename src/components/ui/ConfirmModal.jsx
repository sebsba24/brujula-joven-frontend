export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirmar',
  cancelLabel  = 'Cancelar',
  loading      = false,
  danger       = false,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full animate-fade-in">

        {/* Ícono de advertencia */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4
          ${danger ? 'bg-red-100' : 'bg-yellow-100'}`}>
          <span className="text-2xl">{danger ? '⚠️' : '❓'}</span>
        </div>

        <h3 className="font-bold text-gray-900 text-lg text-center mb-2">{title}</h3>
        <p className="text-gray-500 text-sm text-center mb-6 leading-relaxed">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 btn-secondary disabled:opacity-40"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 text-sm disabled:opacity-40
              ${danger
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-lime-400 text-gray-900 hover:bg-lime-500'}`}
          >
            {loading ? 'Procesando…' : confirmLabel}
          </button>
        </div>

      </div>
    </div>
  )
}
