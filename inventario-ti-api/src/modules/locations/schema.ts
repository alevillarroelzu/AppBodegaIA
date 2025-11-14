import { z } from 'zod'

export const LocationCreate = z.object({
  name: z.string().min(1),
})
export const LocationUpdate = LocationCreate.partial()
