import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'

export default function MovementsPage() {
  const { state, dispatch } = useInventory()
  const [form, setForm] = useState({ itemId: '', type: 'IN', quantity: 1, note: '' })

  function submit(e) {
    e.preventDefault()
    if (!form.itemId || !form.quantity) return alert('Ítem y cantidad son obligatorios')
    const mv = { id: crypto.randomUUID(), ...form, quantity: Number(form.quantity), date: new Date().toISOString() }
    dispatch({ type: 'REGISTER_MOVEMENT', payload: mv })
    setForm({ itemId: '', type: 'IN', quantity: 1, note: '' })
  }

  const columns = [
    { key: 'type', header: 'Tipo' },
    { key: 'itemId', header: 'Ítem' },
    { key: 'quantity', header: 'Cantidad' },
    { key: 'note', header: 'Nota' },
    { key: 'date', header: 'Fecha', cell: (r) => new Date(r.date).toLocaleString() },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Movimientos</h2>

      <form className="card p-4 grid grid-cols-1 md:grid-cols-5 gap-3" onSubmit={submit}>
        <select value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })}
          className="rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700">
          <option value="">Selecciona ítem…</option>
          {state.items.map((it) => (
            <option key={it.id} value={it.id}>{it.code} · {it.name}</option>
          ))}
        </select>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700">
          <option value="IN">Ingreso</option>
          <option value="OUT">Salida</option>
          <option value="ADJ">Ajuste</option>
        </select>
        <input type="number" min={1} value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          className="rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700" />
        <input placeholder="Nota (opcional)" value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 md:col-span-2" />
        <div className="md:col-span-5 flex justify-end">
          <Button type="submit">Registrar</Button>
        </div>
      </form>

      <Table columns={columns} data={state.movements} />
    </div>
  )
}