import type { FastifyReply } from 'fastify'

import { hasDatabaseUrl } from '../config/env.js'

export const ensureDatabase = (reply: FastifyReply) => {
  if (hasDatabaseUrl) {
    return true
  }

  reply.code(503).send({
    message:
      'Database is not configured yet. Add DATABASE_URL to backend/.env to enable this route.',
  })

  return false
}
