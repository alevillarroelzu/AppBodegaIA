import { z } from 'zod'

export const SupplierCreate = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
})
export const SupplierUpdate = SupplierCreate.partial()
