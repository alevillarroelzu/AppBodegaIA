import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'

export default function LocationsPage() {
  const { state, dispatch } = useInventory()
  const [name, setName] = useState('')

  function add(e) {
    e.preventDefault()
    if (!name) return
    dispatch({ type: 'ADD_LOCATION', payload: { id: crypto.randomUUID(), name } })
    setName('')
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Ubicaciones</h2>
      <form onSubmit={add} className="card p-4 flex items-center gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre de ubicación"
          className="rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700" />
        <Button type="submit">Agregar</Button>
      </form>

      <Table columns={[{ key: 'name', header: 'Nombre' }]} data={state.locations} />
    </div>
  )
}