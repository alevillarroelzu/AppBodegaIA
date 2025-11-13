import { prisma } from '../../db/prisma'
import { ItemCreate, ItemUpdate } from './schema'
import { Request, Response } from 'express'

export async function list(_req: Request, res: Response) {
  const data = await prisma.item.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(data)
}

export async function create(req: Request, res: Response) {
  const payload = ItemCreate.parse(req.body)
  const created = await prisma.item.create({ data: payload })
  res.status(201).json(created)
}

export async function get(req: Request, res: Response) {
  const it = await prisma.item.findUnique({ where: { id: req.params.id } })
  if (!it) return res.status(404).json({ message: 'Not found' })
  res.json(it)
}

export async function update(req: Request, res: Response) {
  const data = ItemUpdate.parse(req.body)
  const updated = await prisma.item.update({ where: { id: req.params.id }, data })
  res.json(updated)
}

export async function remove(req: Request, res: Response) {
  await prisma.item.delete({ where: { id: req.params.id } })
  res.status(204).end()
}
