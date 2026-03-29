import type { FastifyPluginAsync } from 'fastify'

import { ensureDatabase } from '../../lib/db-guard.js'
import { prisma } from '../../lib/prisma.js'
import {
  serializeHostListing,
  serializeProperty,
  serializeUser,
} from '../../serializers/domain.js'

export const bootstrapRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (_request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const [users, properties, hostListings] = await Promise.all([
      prisma.user.findMany({
        include: {
          riderProfile: true,
          motorcycle: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.property.findMany({
        include: {
          images: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
          tags: true,
          amenities: true,
          reviews: {
            include: {
              votes: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          votes: true,
          parkingConfirmations: true,
          communityListing: true,
          hostListing: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.hostListing.findMany({
        include: {
          property: {
            include: {
              images: {
                orderBy: {
                  sortOrder: 'asc',
                },
              },
              reviews: {
                include: {
                  votes: true,
                },
                orderBy: {
                  createdAt: 'desc',
                },
              },
            },
          },
        },
      }),
    ] as const)

    return {
      currentUserId: 'rider-current',
      users: users.map(serializeUser),
      properties: (properties as any[]).map(serializeProperty),
      hostListings: (hostListings as any[]).map(serializeHostListing),
    }
  })
}
