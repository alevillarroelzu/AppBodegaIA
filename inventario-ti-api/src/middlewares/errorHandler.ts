import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { logger } from '../config/logger'

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  // Log del error con contexto
  logger.error('Error en request:', {
    method: req.method,
    path: req.path,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })

  // Errores de validación de Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    })
  }

  // Errores de Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Registro duplicado (unique constraint)
    if (err.code === 'P2002') {
      return res.status(409).json({
        message: 'Ya existe un registro con estos datos',
        field: err.meta?.target,
      })
    }
    // Registro no encontrado
    if (err.code === 'P2025') {
      return res.status(404).json({
        message: 'Registro no encontrado',
      })
    }
    // Foreign key constraint
    if (err.code === 'P2003') {
      return res.status(400).json({
        message: 'Referencia inválida a otro registro',
      })
    }
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token inválido',
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expirado',
    })
  }

  // Error genérico
  res.status(500).json({
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  })
}

// Wrapper para manejar errores async en controllers
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
