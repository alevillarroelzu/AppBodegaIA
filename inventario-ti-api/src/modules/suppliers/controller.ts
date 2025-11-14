import { prisma } from '../../db/prisma'
import { SupplierCreate, SupplierUpdate } from './schema'
import { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/errorHandler'

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const data = await prisma.supplier.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(data)
})

export const create = asyncHandler(async (req: Request, res: Response) => {
  const payload = SupplierCreate.parse(req.body)
  const created = await prisma.supplier.create({ data: payload })
  res.status(201).json(created)
})

export const get = asyncHandler(async (req: Request, res: Response) => {
  const supplier = await prisma.supplier.findUnique({ where: { id: req.params.id } })
  if (!supplier) return res.status(404).json({ message: 'Not found' })
  res.json(supplier)
})

export const update = asyncHandler(async (req: Request, res: Response) => {
  const data = SupplierUpdate.parse(req.body)
  const updated = await prisma.supplier.update({ where: { id: req.params.id }, data })
  res.json(updated)
})

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await prisma.supplier.delete({ where: { id: req.params.id } })
  res.status(204).end()
})
