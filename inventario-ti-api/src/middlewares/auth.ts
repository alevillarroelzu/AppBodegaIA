import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.access_token
  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!)
    ;(req as any).user = payload
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}
