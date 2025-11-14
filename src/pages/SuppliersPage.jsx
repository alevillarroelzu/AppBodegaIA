import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'

export default function SuppliersPage() {
  const { state, actions, loading, error } = useInventory()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  function openCreateModal() {
    setEditingSupplier(null)
    setForm({ name: '', email: '' })
    setOpen(true)
  }

  function openEditModal(supplier) {
    setEditingSupplier(supplier)
    setForm({ name: supplier.name, email: supplier.email || '' })
    setOpen(true)
  }

  async function submit(e) {
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
      if (editingSupplier) {
        // Editar proveedor existente
        await actions.updateSupplier(editingSupplier.id, {
          name: form.name.trim(),
          email: form.email.trim() || undefined,
        })
        toast.success('Proveedor actualizado exitosamente')
      } else {
        // Crear nuevo proveedor
        await actions.addSupplier({
          name: form.name.trim(),
          email: form.email.trim() || undefined,
        })
        toast.success('Proveedor creado exitosamente')
      }

      setOpen(false)
      setEditingSupplier(null)
      setForm({ name: '', email: '' })
    } catch (err) {
      console.error('Error guardando proveedor:', err)
      toast.error(err.response?.data?.message || 'Error al guardar el proveedor')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(supplier) {
    if (!confirm(`¿Estás seguro de eliminar el proveedor "${supplier.name}"?`)) return

    setDeletingId(supplier.id)
    try {
      await actions.deleteSupplier(supplier.id)
      toast.success('Proveedor eliminado exitosamente')
    } catch (err) {
      console.error('Error eliminando proveedor:', err)
      toast.error(err.response?.data?.message || 'Error al eliminar el proveedor')
    } finally {
      setDeletingId(null)
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

  const columns = [
    { key: 'name', header: 'Nombre' },
    { key: 'email', header: 'Email', cell: (r) => r.email || '-' },
    {
      key: 'actions',
      header: 'Acciones',
      cell: (r) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(r)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            disabled={deletingId === r.id}
          >
            Editar
          </button>
          <button
            onClick={() => handleDelete(r)}
            className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
            disabled={deletingId === r.id}
          >
            {deletingId === r.id ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Proveedores</h2>
        <Button onClick={openCreateModal}>Nuevo Proveedor</Button>
      </div>

      <Table columns={columns} data={state.suppliers} />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingSupplier ? 'Editar proveedor' : 'Crear proveedor'}
        footer={<Button onClick={() => setOpen(false)} variant="outline">Cerrar</Button>}
      >
        <form className="space-y-3" onSubmit={submit}>
          <div>
            <label className="text-sm">Nombre *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nombre"
              disabled={submitting}
              className="w-full rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-sm">Email (opcional)</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              type="email"
              disabled={submitting}
              className="w-full rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 disabled:opacity-50"
            />
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