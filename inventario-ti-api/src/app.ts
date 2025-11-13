import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { itemsRouter } from './modules/items/routes'
import { locationsRouter } from './modules/locations/routes'
import { suppliersRouter } from './modules/suppliers/routes'
import { movementsRouter } from './modules/movements/routes'

export const app = express()
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/items', itemsRouter)
app.use('/api/locations', locationsRouter)
app.use('/api/suppliers', suppliersRouter)
app.use('/api/movements', movementsRouter)
