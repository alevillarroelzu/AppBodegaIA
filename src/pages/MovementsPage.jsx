import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'

export default function MovementsPage() {
  const { state, actions, loading, error } = useInventory()
  const toast = useToast()
  const [form, setForm] = useState({ itemId: '', type: 'IN', quantity: 1, note: '' })
  const [submitting, setSubmitting] = useState(false)

  async function submit(e) {
    e.preventDefault()

    if (!form.itemId) {
      toast.warning('Selecciona un ítem')
      return
    }

    if (!form.quantity || form.quantity <= 0) {
      toast.error('La cantidad debe ser mayor a 0')
      return
    }

    setSubmitting(true)
    try {
      await actions.registerMovement({
        itemId: form.itemId,
        type: form.type,
        quantity: Number(form.quantity),
        note: form.note || undefined,
      })

      toast.success('Movimiento registrado exitosamente')
      setForm({ itemId: '', type: 'IN', quantity: 1, note: '' })
    } catch (err) {
      console.error('Error registrando movimiento:', err)
      toast.error(err.response?.data?.message || 'Error al registrar el movimiento')
    } finally {
      setSubmitting(false)
    }
  }

  // Manejo de estados de carga y error
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Cargando movimientos...</p>
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
        <select
          value={form.itemId}
          onChange={(e) => setForm({ ...form, itemId: e.target.value })}
          disabled={submitting}
          className="rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 disabled:opacity-50"
        >
          <option value="">Selecciona ítem…</option>
          {state.items.map((it) => (
            <option key={it.id} value={it.id}>
              {it.code} · {it.name}
            </option>
          ))}
        </select>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          disabled={submitting}
          className="rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 disabled:opacity-50"
        >
          <option value="IN">Ingreso</option>
          <option value="OUT">Salida</option>
          <option value="ADJ">Ajuste</option>
        </select>
        <input
          type="number"
          min={1}
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          disabled={submitting}
          className="rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 disabled:opacity-50"
        />
        <input
          placeholder="Nota (opcional)"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          disabled={submitting}
          className="rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 md:col-span-2 disabled:opacity-50"
        />
        <div className="md:col-span-5 flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Registrando...' : 'Registrar'}
          </Button>
        </div>
      </form>

      <Table columns={columns} data={state.movements} />
    </div>
  )
}