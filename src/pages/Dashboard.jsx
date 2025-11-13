import Card from '../components/ui/Card'
import { useInventory } from '../context/InventoryContext'

export default function Dashboard() {
  const { state } = useInventory()
  const totalItems = state.items.length
  const totalStock = state.items.reduce((acc, it) => acc + (it.stock || 0), 0)
  const lowStock = state.items.filter((it) => it.stock <= (it.minStock ?? 0))

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Ítems distintos" value={totalItems} subtitle="SKU o códigos únicos" />
        <Card title="Stock total" value={totalStock} subtitle="Unidades en bodega" />
        <Card title="Bajo stock" value={lowStock.length} subtitle="Por debajo del mínimo" />
      </div>

      <section className="card p-4">
        <h3 className="font-medium mb-3">Últimos movimientos</h3>
        <ul className="space-y-2 text-sm">
          {state.movements.slice(0, 8).map((m) => (
            <li key={m.id} className="flex items-center justify-between">
              <span>
                <span className="font-semibold">{m.type}</span> · {m.itemId} · {m.quantity}
              </span>
              <span className="text-zinc-500">{new Date(m.date).toLocaleString()}</span>
            </li>
          ))}
          {state.movements.length === 0 && <li className="text-zinc-500">Sin movimientos aún.</li>}
        </ul>
      </section>
    </div>
  )
}