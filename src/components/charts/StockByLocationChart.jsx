import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function StockByLocationChart({ items, locations }) {
  // Agrupar items por ubicación
  const data = locations.map((location) => {
    const locationItems = items.filter((item) => item.locationId === location.id)
    return {
      name: location.name,
      cantidad: locationItems.length,
      stock: locationItems.reduce((sum, item) => sum + (item.stock || 0), 0),
    }
  })

  return (
    <div className="card p-4">
      <h3 className="font-medium mb-4">Stock por Ubicación</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="cantidad" fill="#3b82f6" name="Ítems" />
          <Bar dataKey="stock" fill="#10b981" name="Stock Total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
