import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function MovementsTrendChart({ movements }) {
  // Agrupar movimientos por fecha (últimos 7 días)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  const data = last7Days.map((date) => {
    const dayMovements = movements.filter((m) => {
      const movementDate = new Date(m.createdAt || m.date).toISOString().split('T')[0]
      return movementDate === date
    })

    return {
      fecha: new Date(date).toLocaleDateString('es', { month: 'short', day: 'numeric' }),
      ingresos: dayMovements.filter((m) => m.type === 'IN').length,
      salidas: dayMovements.filter((m) => m.type === 'OUT').length,
      ajustes: dayMovements.filter((m) => m.type === 'ADJ').length,
    }
  })

  return (
    <div className="card p-4">
      <h3 className="font-medium mb-4">Tendencia de Movimientos (7 días)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="fecha" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} name="Ingresos" />
          <Line type="monotone" dataKey="salidas" stroke="#ef4444" strokeWidth={2} name="Salidas" />
          <Line type="monotone" dataKey="ajustes" stroke="#f59e0b" strokeWidth={2} name="Ajustes" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
