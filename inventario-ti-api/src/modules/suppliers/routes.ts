import { Router } from 'express'
import * as c from './controller'
export const suppliersRouter = Router()
suppliersRouter.get('/', c.list)
suppliersRouter.post('/', c.create)
suppliersRouter.get('/:id', c.get)
suppliersRouter.put('/:id', c.update)
suppliersRouter.delete('/:id', c.remove)
