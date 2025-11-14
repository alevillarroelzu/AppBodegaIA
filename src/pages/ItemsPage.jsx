import { useMemo, useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Table from '../components/ui/Table'
import { useDebounce } from '../hooks/useDebounce'

export default function ItemsPage() {
  const { state, actions, loading, error } = useInventory()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const q = useDebounce(query)

  const filtered = useMemo(() => {
    const txt = q.trim().toLowerCase()
    if (!txt) return state.items
    return state.items.filter(
      (it) => it.name.toLowerCase().includes(txt) || it.code.toLowerCase().includes(txt),
    )
  }, [state.items, q])

  const defaultLocation = state.locations[0]?.id || ''
  const [form, setForm] = useState({ code: '', name: '', stock: 0, minStock: 0, locationId: defaultLocation })

  async function submit(e) {
    e.preventDefault()

    // Validación
    if (!form.code || !form.name) {
      toast.error('Código y nombre son obligatorios')
      return
    }

    setSubmitting(true)
    try {
      await actions.addItem({
        code: form.code,
        name: form.name,
        stock: Number(form.stock || 0),
        minStock: Number(form.minStock || 0),
        locationId: form.locationId || undefined,
      })

      toast.success('Ítem creado exitosamente')
      setOpen(false)
      setForm({ code: '', name: '', stock: 0, minStock: 0, locationId: defaultLocation })
    } catch (err) {
      console.error('Error creando ítem:', err)
      toast.error(err.response?.data?.message || 'Error al crear el ítem')
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
          <p className="text-zinc-600 dark:text-zinc-400">Cargando ítems...</p>
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
    { key: 'code', header: 'Código' },
    { key: 'name', header: 'Nombre' },
    { key: 'stock', header: 'Stock' },
    {
      key: 'minStock',
      header: 'Mínimo',
      cell: (r) => (
        <span className={r.stock <= r.minStock ? 'text-red-600 font-semibold' : ''}>{r.minStock}</span>
      ),
    },
    { key: 'locationId', header: 'Ubicación' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Ítems</h2>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por código o nombre"
            className="rounded-xl border px-3 py-2 text-sm w-56 border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 dark:bg-zinc-900 dark:border-zinc-700"
          />
          <Button onClick={() => setOpen(true)}>Nuevo Ítem</Button>
        </div>
      </div>

      <Table columns={columns} data={filtered} />

      <Modal open={open} onClose={() => setOpen(false)} title="Crear ítem"
        footer={<Button onClick={() => setOpen(false)} variant="outline">Cerrar</Button>}>
        <form className="space-y-3" onSubmit={submit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Código *</label>
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700" />
            </div>
            <div>
              <label className="text-sm">Nombre *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700" />
            </div>
            <div>
              <label className="text-sm">Stock inicial</label>
              <input type="number" value={form.stock} min={0} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700" />
            </div>
            <div>
              <label className="text-sm">Stock mínimo</label>
              <input type="number" value={form.minStock} min={0} onChange={(e) => setForm({ ...form, minStock: e.target.value })}
                className="w-full rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700" />
            </div>
            <div>
              <label className="text-sm">Ubicación</label>
              <select value={form.locationId} onChange={(e) => setForm({ ...form, locationId: e.target.value })}
                className="w-full rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700">
                {state.locations.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}