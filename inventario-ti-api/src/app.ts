import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { itemsRouter } from './modules/items/routes'
import { locationsRouter } from './modules/locations/routes'
import { suppliersRouter } from './modules/suppliers/routes'
import { movementsRouter } from './modules/movements/routes'
import { errorHandler } from './middlewares/errorHandler'
// import { requireAuth } from './middlewares/auth'

export const app = express()
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Rutas públicas (sin autenticación por ahora)
// Para habilitar autenticación, descomenta la siguiente línea:
// app.use('/api', requireAuth)

app.use('/api/items', itemsRouter)
app.use('/api/locations', locationsRouter)
app.use('/api/suppliers', suppliersRouter)
app.use('/api/movements', movementsRouter)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Manejo global de errores (debe ir al final)
app.use(errorHandler)
