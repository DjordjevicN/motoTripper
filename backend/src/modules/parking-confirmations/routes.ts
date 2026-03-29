import type { FastifyPluginAsync } from 'fastify'

import { prisma } from '../../lib/prisma.js'
import { ensureDatabase } from '../../lib/db-guard.js'

export const parkingConfirmationRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (_request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const confirmations = await prisma.parkingConfirmation.findMany({
      include: {
        user: true,
        property: true,
        review: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { items: confirmations }
  })
}
