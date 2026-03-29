import type { FastifyPluginAsync } from 'fastify'

import { prisma } from '../../lib/prisma.js'
import { ensureDatabase } from '../../lib/db-guard.js'
import { serializeProperty } from '../../serializers/domain.js'

export const propertyRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (_request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const properties = await prisma.property.findMany({
      include: {
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        tags: true,
        amenities: true,
        reviews: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        parkingConfirmations: true,
        hostListing: true,
        communityListing: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { items: properties.map(serializeProperty) }
  })

  app.get('/:propertyId', async (request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const { propertyId } = request.params as { propertyId: string }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        tags: true,
        amenities: true,
        reviews: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        parkingConfirmations: true,
        hostListing: true,
        communityListing: true,
      },
    })

    if (!property) {
      return reply.code(404).send({ message: 'Property not found.' })
    }

    return { item: serializeProperty(property) }
  })
}
