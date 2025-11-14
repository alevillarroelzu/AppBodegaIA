export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="text-6xl mb-4 opacity-50">{icon}</div>}
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{title}</h3>
      {description && <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
