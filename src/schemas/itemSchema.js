import { z } from 'zod'

export const itemSchema = z.object({
  code: z.string().min(1, 'El código es obligatorio').min(3, 'El código debe tener al menos 3 caracteres'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo'),
  minStock: z.coerce.number().int().min(0, 'El stock mínimo no puede ser negativo'),
  locationId: z.string().optional(),
  supplierId: z.string().optional(),
})

export const locationSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').min(2, 'El nombre debe tener al menos 2 caracteres'),
})

export const supplierSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
})

export const movementSchema = z.object({
  itemId: z.string().min(1, 'Debes seleccionar un ítem'),
  type: z.enum(['IN', 'OUT', 'ADJ'], { required_error: 'El tipo es obligatorio' }),
  quantity: z.coerce.number().int().positive('La cantidad debe ser mayor a 0'),
  note: z.string().optional(),
})
