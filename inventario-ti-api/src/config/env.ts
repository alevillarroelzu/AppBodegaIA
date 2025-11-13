import 'dotenv/config'
import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development','production']).default('development'),
  PORT: z.coerce.number().default(8090),
  CORS_ORIGIN: z.string().url(),

  DATABASE_URL: z.string().min(1),

  APP_ACCESS_KEY_ID: z.string().min(1),
  APP_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_REGION: z.string().min(1),
  AWS_BUCKET: z.string().min(1),

  MAIL_HOST: z.string().min(1),
  MAIL_PORT: z.coerce.number(),
  MAIL_SECURE: z.coerce.boolean(),
  MAIL_USER: z.string().min(1),
  MAIL_PASS: z.string().min(1),

  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES: z.string().default('20m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
})

export const env = EnvSchema.parse(process.env)
