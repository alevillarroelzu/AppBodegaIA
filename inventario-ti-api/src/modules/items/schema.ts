import { z } from 'zod'

export const ItemCreate = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  stock: z.number().int().min(0).default(0),
  minStock: z.number().int().min(0).default(0),
  locationId: z.string().optional(),
  supplierId: z.string().optional(),
})
export const ItemUpdate = ItemCreate.partial()
