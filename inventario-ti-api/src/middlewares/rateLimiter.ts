import rateLimit from 'express-rate-limit'
import { logger } from '../config/logger'

// Rate limiter general para toda la API
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por IP en 15 minutos
  message: {
    error: 'Too Many Requests',
    message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde',
  },
  standardHeaders: true, // Devuelve rate limit info en headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita headers `X-RateLimit-*`
  handler: (req, res) => {
    logger.warn(`Rate limit excedido para IP: ${req.ip}`, {
      ip: req.ip,
      path: req.path,
    })
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde',
    })
  },
})

// Rate limiter más estricto para operaciones de escritura
export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // Máximo 50 operaciones de escritura en 15 minutos
  message: {
    error: 'Too Many Requests',
    message: 'Demasiadas operaciones de escritura, por favor intente más tarde',
  },
  skip: (req) => req.method === 'GET', // Solo aplica a POST, PUT, DELETE
})

// Rate limiter muy permisivo para health check
export const healthLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30, // 30 requests por minuto
  message: 'Demasiadas verificaciones de salud',
})
