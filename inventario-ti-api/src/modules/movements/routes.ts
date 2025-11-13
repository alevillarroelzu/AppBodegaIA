import { Router } from 'express'
import * as c from './controller'
export const movementsRouter = Router()
movementsRouter.post('/', c.register)
