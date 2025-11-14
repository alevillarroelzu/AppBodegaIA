import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'

export default function LocationsPage() {
  const { state, actions, loading, error } = useInventory()
  const toast = useToast()
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function add(e) {
    e.preventDefault()

    if (!name.trim()) {
      toast.warning('Ingresa un nombre para la ubicación')
      return
    }

    setSubmitting(true)
    try {
      await actions.addLocation({ name: name.trim() })
      toast.success('Ubicación creada exitosamente')
      setName('')
    } catch (err) {
      console.error('Error creando ubicación:', err)
      toast.error(err.response?.data?.message || 'Error al crear la ubicación')
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Ubicaciones</h2>
      <form onSubmit={add} className="card p-4 flex items-center gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de ubicación"
          disabled={submitting}
          className="rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 disabled:opacity-50"
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Agregando...' : 'Agregar'}
        </Button>
      </form>

      <Table columns={[{ key: 'name', header: 'Nombre' }]} data={state.locations} />
    </div>
  )
}