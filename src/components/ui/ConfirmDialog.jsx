import { useEffect } from 'react'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'danger' }) {
  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  if (!open) return null

  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  }

  const iconColors = {
    danger: 'bg-red-100 text-red-600',
    warning: 'bg-yellow-100 text-yellow-600',
    info: 'bg-blue-100 text-blue-600',
  }

  const icons = {
    danger: '⚠️',
    warning: '⚡',
    info: 'ℹ️',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${iconColors[type]}`}>
            <span className="text-2xl">{icons[type]}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">{title}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColors[type]}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 font-medium text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}
