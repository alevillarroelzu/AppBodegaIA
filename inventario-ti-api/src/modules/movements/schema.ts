import { z } from 'zod'

export const MovementCreate = z.object({
  itemId: z.string().min(1, 'Item ID es requerido'),
  type: z.enum(['IN', 'OUT', 'ADJ'], {
    errorMap: () => ({ message: 'Tipo debe ser IN, OUT o ADJ' }),
  }),
  quantity: z.number().int().positive('La cantidad debe ser positiva'),
  note: z.string().optional(),
})

export type MovementCreateInput = z.infer<typeof MovementCreate>
