import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'

export default function LocationsPage() {
  const { state, actions, loading, error } = useInventory()
  const toast = useToast()
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  function openCreateModal() {
    setEditingLocation(null)
    setName('')
    setOpen(true)
  }

  function openEditModal(location) {
    setEditingLocation(location)
    setName(location.name)
    setOpen(true)
  }

  async function submit(e) {
    e.preventDefault()

    if (!name.trim()) {
      toast.warning('Ingresa un nombre para la ubicación')
      return
    }

    setSubmitting(true)
    try {
      if (editingLocation) {
        // Editar ubicación existente
        await actions.updateLocation(editingLocation.id, { name: name.trim() })
        toast.success('Ubicación actualizada exitosamente')
      } else {
        // Crear nueva ubicación
        await actions.addLocation({ name: name.trim() })
        toast.success('Ubicación creada exitosamente')
      }

      setOpen(false)
      setEditingLocation(null)
      setName('')
    } catch (err) {
      console.error('Error guardando ubicación:', err)
      toast.error(err.response?.data?.message || 'Error al guardar la ubicación')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(location) {
    if (!confirm(`¿Estás seguro de eliminar la ubicación "${location.name}"?`)) return

    setDeletingId(location.id)
    try {
      await actions.deleteLocation(location.id)
      toast.success('Ubicación eliminada exitosamente')
    } catch (err) {
      console.error('Error eliminando ubicación:', err)
      toast.error(err.response?.data?.message || 'Error al eliminar la ubicación')
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
          <p className="text-zinc-600 dark:text-zinc-400">Cargando ubicaciones...</p>
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
        <h2 className="text-xl font-semibold">Ubicaciones</h2>
        <Button onClick={openCreateModal}>Nueva Ubicación</Button>
      </div>

      <Table columns={columns} data={state.locations} />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingLocation ? 'Editar ubicación' : 'Crear ubicación'}
        footer={<Button onClick={() => setOpen(false)} variant="outline">Cerrar</Button>}
      >
        <form className="space-y-3" onSubmit={submit}>
          <div>
            <label className="text-sm">Nombre *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de ubicación"
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