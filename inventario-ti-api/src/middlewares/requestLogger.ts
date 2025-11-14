import morgan from 'morgan'
import { httpStream } from '../config/logger'

// Formato personalizado de Morgan
const morganFormat = ':method :url :status :res[content-length] - :response-time ms'

// Middleware de Morgan con Winston
export const requestLogger = morgan(morganFormat, {
  stream: httpStream,
  skip: (req) => {
    // No loguear health checks para no saturar los logs
    return req.url === '/health'
  },
})
