export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="card overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded flex-1"></div>
            ))}
          </div>
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex gap-4">
              {Array.from({ length: columns }).map((_, j) => (
                <div key={j} className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded flex-1"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3"></div>
    </div>
  )
}

export function ListSkeleton({ items = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="card p-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
