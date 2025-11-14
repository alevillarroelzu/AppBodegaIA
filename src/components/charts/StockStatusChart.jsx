import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#10b981', '#f59e0b', '#ef4444']

export default function StockStatusChart({ items }) {
  const normalStock = items.filter((it) => it.stock > it.minStock).length
  const lowStock = items.filter((it) => it.stock > 0 && it.stock <= it.minStock).length
  const outOfStock = items.filter((it) => it.stock === 0).length

  const data = [
    { name: 'Stock Normal', value: normalStock },
    { name: 'Bajo Stock', value: lowStock },
    { name: 'Sin Stock', value: outOfStock },
  ].filter((item) => item.value > 0) // Filtrar valores en 0

  if (data.length === 0) {
    return (
      <div className="card p-4 flex items-center justify-center h-[350px]">
        <p className="text-zinc-500">No hay datos disponibles</p>
      </div>
    )
  }

  return (
    <div className="card p-4">
      <h3 className="font-medium mb-4">Estado del Inventario</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
