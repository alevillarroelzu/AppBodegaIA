import { prisma } from '../../db/prisma'
import { z } from 'zod'
import { Request, Response } from 'express'

const MovementCreate = z.object({
  itemId: z.string(),
  type: z.enum(['IN','OUT','ADJ']),
  quantity: z.number().int().positive(),
  note: z.string().optional(),
})

export async function register(req: Request, res: Response) {
  const { itemId, type, quantity, note } = MovementCreate.parse(req.body)

  const result = await prisma.$transaction(async (tx) => {
    // Bloqueo de fila del ítem para evitar carreras de stock.
    // Usamos SQL nativo: SELECT ... FOR UPDATE.
    await tx.$executeRawUnsafe(
      `SELECT id FROM "Item" WHERE id = $1 FOR UPDATE`,
      itemId
    )

    const item = await tx.item.findUnique({ where: { id: itemId } })
    if (!item) throw new Error('Item not found')

    let newStock = item.stock
    if (type === 'IN') newStock += quantity
    else if (type === 'OUT') {
      if (item.stock < quantity) throw new Error('Insufficient stock')
      newStock -= quantity
    } else { // ADJ: ajuste (positivo o negativo)
      newStock += quantity
    }

    const mv = await tx.movement.create({
      data: { itemId, type, quantity, note },
    })
    await tx.item.update({ where: { id: itemId }, data: { stock: newStock } })
    return mv
  })

  res.status(201).json(result)
}
