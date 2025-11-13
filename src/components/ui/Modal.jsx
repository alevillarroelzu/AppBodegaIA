export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-sm text-zinc-500">Cerrar</button>
        </div>
        <div className="mb-4">{children}</div>
        {footer && <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">{footer}</div>}
      </div>
    </div>
  )
}