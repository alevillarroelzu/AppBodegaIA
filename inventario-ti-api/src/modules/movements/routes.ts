import { Router } from 'express'
import * as c from './controller'
export const movementsRouter = Router()
movementsRouter.get('/', c.list)
movementsRouter.post('/', c.register)
