import { Router } from 'express'
import * as c from './controller'
export const itemsRouter = Router()
itemsRouter.get('/', c.list)
itemsRouter.post('/', c.create)
itemsRouter.get('/:id', c.get)
itemsRouter.put('/:id', c.update)
itemsRouter.delete('/:id', c.remove)
