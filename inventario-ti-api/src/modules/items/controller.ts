import { prisma } from '../../db/prisma'
import { ItemCreate, ItemUpdate } from './schema'
import { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/errorHandler'

export const list = asyncHandler(async (req: Request, res: Response) => {
  // Paginación (opcional)
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 50
  const skip = (page - 1) * limit

  // Búsqueda (opcional)
  const search = req.query.search as string

  const where = search
    ? {
        OR: [
          { code: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  // Obtener total de registros para paginación
  const total = await prisma.item.count({ where })

  // Obtener datos con paginación
  const data = await prisma.item.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      location: true,
      supplier: true,
    },
  })

  // Respuesta con metadatos de paginación
  res.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  })
})

export const create = asyncHandler(async (req: Request, res: Response) => {
  const payload = ItemCreate.parse(req.body)
  const created = await prisma.item.create({ data: payload })
  res.status(201).json(created)
})

export const get = asyncHandler(async (req: Request, res: Response) => {
  const it = await prisma.item.findUnique({
    where: { id: req.params.id },
    include: {
      location: true,
      supplier: true,
    }
  })
  if (!it) return res.status(404).json({ message: 'Not found' })
  res.json(it)
})

export const update = asyncHandler(async (req: Request, res: Response) => {
  const data = ItemUpdate.parse(req.body)
  const updated = await prisma.item.update({ where: { id: req.params.id }, data })
  res.json(updated)
})

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await prisma.item.delete({ where: { id: req.params.id } })
  res.status(204).end()
})
