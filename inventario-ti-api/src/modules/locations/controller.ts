import { prisma } from '../../db/prisma'
import { LocationCreate, LocationUpdate } from './schema'
import { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/errorHandler'

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const data = await prisma.location.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(data)
})

export const create = asyncHandler(async (req: Request, res: Response) => {
  const payload = LocationCreate.parse(req.body)
  const created = await prisma.location.create({ data: payload })
  res.status(201).json(created)
})

export const get = asyncHandler(async (req: Request, res: Response) => {
  const location = await prisma.location.findUnique({ where: { id: req.params.id } })
  if (!location) return res.status(404).json({ message: 'Not found' })
  res.json(location)
})

export const update = asyncHandler(async (req: Request, res: Response) => {
  const data = LocationUpdate.parse(req.body)
  const updated = await prisma.location.update({ where: { id: req.params.id }, data })
  res.json(updated)
})

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await prisma.location.delete({ where: { id: req.params.id } })
  res.status(204).end()
})
