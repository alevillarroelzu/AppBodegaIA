/**
 * EJEMPLO DE IMPLEMENTACIÓN CON REACT HOOK FORM + ZOD
 *
 * Este es un componente de ejemplo que muestra cómo usar React Hook Form
 * con validación de Zod. Puedes usar este patrón en otros formularios.
 *
 * Para usarlo, reemplaza el formulario actual en ItemsPage con este componente.
 *
 * NOTA: Requiere que las dependencias estén instaladas:
 * npm install react-hook-form @hookform/resolvers zod
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { itemSchema } from '../../schemas/itemSchema'
import Button from '../ui/Button'

export default function ItemFormWithValidation({ onSubmit, initialValues, locations, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: initialValues || {
      code: '',
      name: '',
      stock: 0,
      minStock: 0,
      locationId: '',
    },
  })

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Código */}
        <div>
          <label className="text-sm font-medium block mb-1">
            Código <span className="text-red-500">*</span>
          </label>
          <input
            {...register('code')}
            className="w-full rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700"
            disabled={submitting}
          />
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
        </div>

        {/* Nombre */}
        <div>
          <label className="text-sm font-medium block mb-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name')}
            className="w-full rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700"
            disabled={submitting}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Stock inicial */}
        <div>
          <label className="text-sm font-medium block mb-1">Stock inicial</label>
          <input
            type="number"
            {...register('stock')}
            className="w-full rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700"
            disabled={submitting}
          />
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
        </div>

        {/* Stock mínimo */}
        <div>
          <label className="text-sm font-medium block mb-1">Stock mínimo</label>
          <input
            type="number"
            {...register('minStock')}
            className="w-full rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700"
            disabled={submitting}
          />
          {errors.minStock && <p className="text-red-500 text-xs mt-1">{errors.minStock.message}</p>}
        </div>

        {/* Ubicación */}
        <div>
          <label className="text-sm font-medium block mb-1">Ubicación</label>
          <select
            {...register('locationId')}
            className="w-full rounded-xl border px-3 py-2 text-sm border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700"
            disabled={submitting}
          >
            <option value="">Seleccionar...</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          {errors.locationId && <p className="text-red-500 text-xs mt-1">{errors.locationId.message}</p>}
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
