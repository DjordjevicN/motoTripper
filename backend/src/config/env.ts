import 'dotenv/config'

const rawPort = Number(process.env.PORT ?? 4000)

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number.isNaN(rawPort) ? 4000 : rawPort,
  databaseUrl: process.env.DATABASE_URL ?? '',
}

export const hasDatabaseUrl = Boolean(env.databaseUrl)
