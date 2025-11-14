import { Router } from 'express'
import * as c from './controller'
export const locationsRouter = Router()
locationsRouter.get('/', c.list)
locationsRouter.post('/', c.create)
locationsRouter.get('/:id', c.get)
locationsRouter.put('/:id', c.update)
locationsRouter.delete('/:id', c.remove)
