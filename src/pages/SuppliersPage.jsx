import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'

export default function SuppliersPage() {
  const { state, actions, loading, error } = useInventory()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '' })
  const [submitting, setSubmitting] = useState(false)

  async function add(e) {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.warning('Ingresa un nombre para el proveedor')
      return
    }

    // Validar email si se proporciona
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Email inválido')
      return
    }

    setSubmitting(true)
    try {
      await actions.addSupplier({
        name: form.name.trim(),
        email: form.email.trim() || undefined,
      })
      toast.success('Proveedor creado exitosamente')
      setForm({ name: '', email: '' })
    } catch (err) {
      console.error('Error creando proveedor:', err)
      toast.error(err.response?.data?.message || 'Error al crear el proveedor')
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
          <p className="text-zinc-600 dark:text-zinc-400">Cargando proveedores...</p>
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Proveedores</h2>
      <form onSubmit={add} className="card p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nombre"
          disabled={submitting}
          className="rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 disabled:opacity-50"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email (opcional)"
          type="email"
          disabled={submitting}
          className="rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 disabled:opacity-50"
        />
        <div className="flex items-center justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Agregando...' : 'Agregar'}
          </Button>
        </div>
      </form>

      <Table columns={[{ key: 'name', header: 'Nombre' }, { key: 'email', header: 'Email' }]} data={state.suppliers} />
    </div>
  )
}