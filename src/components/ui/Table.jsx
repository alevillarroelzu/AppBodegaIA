export default function Table({ columns, data, keyField = 'id' }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="text-left px-3 py-2 font-medium text-zinc-600">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row[keyField]} className="border-t border-zinc-100 dark:border-zinc-800">
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2">
                  {col.cell ? col.cell(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td className="px-3 py-6 text-center text-zinc-500" colSpan={columns.length}>
                Sin datos para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}