import { prisma } from '../../db/prisma'
import { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/errorHandler'
import { MovementCreate } from './schema'

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const data = await prisma.movement.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      item: {
        select: {
          code: true,
          name: true,
        }
      }
    }
  })
  res.json(data)
})

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { itemId, type, quantity, note } = MovementCreate.parse(req.body)

  const result = await prisma.$transaction(async (tx) => {
    // Bloqueo de fila del ítem para evitar carreras de stock.
    await tx.$executeRaw`SELECT id FROM "Item" WHERE id = ${itemId} FOR UPDATE`

    const item = await tx.item.findUnique({ where: { id: itemId } })
    if (!item) throw new Error('Item not found')

    let newStock = item.stock
    if (type === 'IN') {
      newStock += quantity
    } else if (type === 'OUT') {
      if (item.stock < quantity) throw new Error('Insufficient stock')
      newStock -= quantity
    } else {
      // ADJ: ajuste (puede ser positivo o negativo)
      newStock += quantity
      // Validar que el stock no quede negativo después del ajuste
      if (newStock < 0) {
        throw new Error(`Adjustment would result in negative stock. Current: ${item.stock}, Adjustment: ${quantity}, Result: ${newStock}`)
      }
    }

    const mv = await tx.movement.create({
      data: { itemId, type, quantity, note },
      include: {
        item: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    })
    await tx.item.update({ where: { id: itemId }, data: { stock: newStock } })
    return mv
  })

  res.status(201).json(result)
})
