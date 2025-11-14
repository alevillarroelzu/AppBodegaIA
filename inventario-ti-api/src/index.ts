import { app } from './app'
import { logger } from './config/logger'

const PORT = process.env.PORT ?? 8090

const server = app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en puerto ${PORT}`)
  logger.info(`📊 Health check disponible en http://localhost:${PORT}/health`)
  logger.info(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`)
})

// Manejo de errores no capturados
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason)
  process.exit(1)
})

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM recibido, cerrando servidor...')
  server.close(() => {
    logger.info('Servidor cerrado correctamente')
    process.exit(0)
  })
})
