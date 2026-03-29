import type { FastifyPluginAsync } from 'fastify'

import { prisma } from '../../lib/prisma.js'
import { ensureDatabase } from '../../lib/db-guard.js'
import { serializeHostListing } from '../../serializers/domain.js'

export const listingRoutes: FastifyPluginAsync = async (app) => {
  app.get('/host-listings', async (_request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const listings = await prisma.hostListing.findMany({
      include: {
        property: {
          include: {
            images: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
            reviews: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
        hostUser: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { items: listings.map(serializeHostListing) }
  })

  app.get('/community-listings', async (_request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const listings = await prisma.communityListing.findMany({
      include: {
        property: true,
        submittedByUser: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { items: listings }
  })
}
