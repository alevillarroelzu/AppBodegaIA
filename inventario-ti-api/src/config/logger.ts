import { createLogger, format, transports } from 'winston'

const isProduction = process.env.NODE_ENV === 'production'

// Formato para desarrollo (colorido y legible)
const devFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    return `${timestamp} [${level}]: ${message} ${metaStr}`
  })
)

// Formato para producción (JSON estructurado)
const prodFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json()
)

export const logger = createLogger({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  format: isProduction ? prodFormat : devFormat,
  transports: [
    // Consola para todos los niveles
    new transports.Console(),

    // Archivo para errores
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // Archivo para todos los logs
    new transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    }),
  ],
  // No salir en caso de error de logging
  exitOnError: false,
})

// Stream para Morgan (HTTP logging)
export const httpStream = {
  write: (message: string) => {
    logger.http(message.trim())
  },
}
