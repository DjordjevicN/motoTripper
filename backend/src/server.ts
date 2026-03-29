import { buildApp } from './app.js'
import { env } from './config/env.js'
import { prisma } from './lib/prisma.js'

const start = async () => {
  const app = buildApp()

  try {
    await app.listen({
      host: '0.0.0.0',
      port: env.port,
    })
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

const shutdown = async () => {
  if (prisma) {
    await prisma.$disconnect()
  }
}

process.on('SIGINT', () => {
  void shutdown().finally(() => process.exit(0))
})

process.on('SIGTERM', () => {
  void shutdown().finally(() => process.exit(0))
})

void start()
