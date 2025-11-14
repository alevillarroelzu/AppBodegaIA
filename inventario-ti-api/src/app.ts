import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import { itemsRouter } from './modules/items/routes'
import { locationsRouter } from './modules/locations/routes'
import { suppliersRouter } from './modules/suppliers/routes'
import { movementsRouter } from './modules/movements/routes'
import { errorHandler } from './middlewares/errorHandler'
import { requestLogger } from './middlewares/requestLogger'
import { generalLimiter, healthLimiter } from './middlewares/rateLimiter'
import { logger } from './config/logger'
import { prisma } from './db/prisma'
// import { requireAuth } from './middlewares/auth'

export const app = express()

// Seguridad HTTP con Helmet
app.use(helmet())

// Compresión de respuestas
app.use(compression())

// CORS
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Request logging
app.use(requestLogger)

// Log de inicio
logger.info('Middlewares configurados correctamente')

// Rutas públicas (sin autenticación por ahora)
// Para habilitar autenticación, descomenta la siguiente línea:
// app.use('/api', requireAuth)

// Rate limiting en rutas de API
app.use('/api', generalLimiter)

app.use('/api/items', itemsRouter)
app.use('/api/locations', locationsRouter)
app.use('/api/suppliers', suppliersRouter)
app.use('/api/movements', movementsRouter)

// Health check mejorado con verificación de BD
app.get('/health', healthLimiter, async (_req, res) => {
  try {
    // Verificar conexión a la base de datos
    await prisma.$queryRaw`SELECT 1`

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
    })
  } catch (error) {
    logger.error('Health check failed:', error)
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: 'Database connection failed',
    })
  }
})

// Middleware para rutas no encontradas (404)
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'La ruta solicitada no existe',
    timestamp: new Date().toISOString(),
  })
})

// Manejo global de errores (debe ir al final)
app.use(errorHandler)
