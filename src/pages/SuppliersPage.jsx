import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'

export default function SuppliersPage() {
  const { state, dispatch } = useInventory()
  const [form, setForm] = useState({ name: '', email: '' })

  function add(e) {
    e.preventDefault()
    if (!form.name) return
    dispatch({ type: 'ADD_SUPPLIER', payload: { id: crypto.randomUUID(), ...form } })
    setForm({ name: '', email: '' })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Proveedores</h2>
      <form onSubmit={add} className="card p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre"
          className="rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700" />
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email"
          className="rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700" />
        <div className="flex items-center justify-end"><Button type="submit">Agregar</Button></div>
      </form>

      <Table columns={[{ key: 'name', header: 'Nombre' }, { key: 'email', header: 'Email' }]} data={state.suppliers} />
    </div>
  )
}