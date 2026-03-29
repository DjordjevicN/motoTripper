import type { FastifyPluginAsync } from 'fastify'

import { prisma } from '../../lib/prisma.js'
import { ensureDatabase } from '../../lib/db-guard.js'
import { serializeReview } from '../../serializers/domain.js'

export const reviewRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (_request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const reviews = await prisma.review.findMany({
      include: {
        user: true,
        property: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { items: reviews.map((review) => serializeReview(review)) }
  })
}
