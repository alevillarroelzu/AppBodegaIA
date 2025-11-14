import Card from '../components/ui/Card'
import { useInventory } from '../context/InventoryContext'
import StockByLocationChart from '../components/charts/StockByLocationChart'
import MovementsTrendChart from '../components/charts/MovementsTrendChart'
import StockStatusChart from '../components/charts/StockStatusChart'

export default function Dashboard() {
  const { state, loading, error } = useInventory()

  // Manejo de estados de carga y error
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error al cargar los datos</p>
          <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
        </div>
      </div>
    )
  }

  const totalItems = state.items.length
  const totalStock = state.items.reduce((acc, it) => acc + (it.stock || 0), 0)
  const lowStock = state.items.filter((it) => it.stock <= (it.minStock ?? 0))

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Ítems distintos" value={totalItems} subtitle="SKU o códigos únicos" />
        <Card title="Stock total" value={totalStock} subtitle="Unidades en bodega" />
        <Card title="Bajo stock" value={lowStock.length} subtitle="Por debajo del mínimo" />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StockByLocationChart items={state.items} locations={state.locations} />
        <StockStatusChart items={state.items} />
      </div>

      <MovementsTrendChart movements={state.movements} />

      {/* Últimos movimientos */}
      <section className="card p-4">
        <h3 className="font-medium mb-3">Últimos movimientos</h3>
        <ul className="space-y-2 text-sm">
          {state.movements.slice(0, 8).map((m) => (
            <li key={m.id} className="flex items-center justify-between">
              <span>
                <span className="font-semibold">{m.type}</span> · {m.itemId} · {m.quantity}
              </span>
              <span className="text-zinc-500">{new Date(m.createdAt || m.date).toLocaleString()}</span>
            </li>
          ))}
          {state.movements.length === 0 && <li className="text-zinc-500">Sin movimientos aún.</li>}
        </ul>
      </section>
    </div>
  )
}