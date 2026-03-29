import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

import { prisma } from '../../lib/prisma.js'
import { ensureDatabase } from '../../lib/db-guard.js'
import { serializeProperty } from '../../serializers/domain.js'

const updatePropertySchema = z.object({
  actorUserId: z.string().min(1),
  title: z.string().min(1).max(160),
  description: z.string().min(1).max(2000),
  locationLabel: z.string().min(1).max(160),
  phone: z.string().max(50).optional(),
  websiteUrl: z.string().url().optional().or(z.literal('')).optional(),
  paidPromotionPlan: z.enum(['week', 'month', 'year']).nullable().optional(),
})

const getPromotionUntil = (plan: 'week' | 'month' | 'year') => {
  const now = new Date()

  if (plan === 'week') {
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  }

  if (plan === 'month') {
    const until = new Date(now)
    until.setMonth(until.getMonth() + 1)
    return until
  }

  const until = new Date(now)
  until.setFullYear(until.getFullYear() + 1)
  return until
}

const canManageProperty = ({
  actorId,
  actorRole,
  property,
}: {
  actorId: string
  actorRole: 'ADMIN' | 'HOST' | 'RIDER'
  property: {
    hostListing: { hostUserId: string } | null
    communityListing: { submittedByUserId: string } | null
  }
}) =>
  actorRole === 'ADMIN' ||
  property.hostListing?.hostUserId === actorId ||
  property.communityListing?.submittedByUserId === actorId

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
          include: {
            votes: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        votes: true,
        parkingConfirmations: true,
        hostListing: true,
        communityListing: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    } as any)

    return { items: (properties as any[]).map(serializeProperty) }
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
          include: {
            votes: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        votes: true,
        parkingConfirmations: true,
        hostListing: true,
        communityListing: true,
      },
    } as any)

    if (!property) {
      return reply.code(404).send({ message: 'Property not found.' })
    }

    return { item: serializeProperty(property as any) }
  })

  app.patch('/:propertyId', async (request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const { propertyId } = request.params as { propertyId: string }
    const parsed = updatePropertySchema.safeParse(request.body)

    if (!parsed.success) {
      return reply.code(400).send({
        message: 'Invalid property payload.',
        issues: parsed.error.flatten(),
      })
    }

    const body = parsed.data
    const actor = await prisma.user.findUnique({
      where: { id: body.actorUserId },
      select: { id: true, platformRole: true, isBanned: true },
    })

    if (!actor || actor.isBanned) {
      return reply.code(403).send({ message: 'You are not allowed to edit this property.' })
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        hostListing: true,
        communityListing: true,
        images: { orderBy: { sortOrder: 'asc' } },
        tags: true,
        amenities: true,
        reviews: { include: { votes: true }, orderBy: { createdAt: 'desc' } },
        votes: true,
        parkingConfirmations: true,
      },
    } as any)

    if (!property) {
      return reply.code(404).send({ message: 'Property not found.' })
    }

    if (
      !canManageProperty({
        actorId: actor.id,
        actorRole: actor.platformRole,
        property: property as any,
      })
    ) {
      return reply.code(403).send({ message: 'You can only edit your own properties.' })
    }

    if (body.paidPromotionPlan !== undefined && actor.platformRole !== 'ADMIN') {
      return reply
        .code(403)
        .send({ message: 'Only admins can manage paid promotion for a property.' })
    }

    const paidPromotionData =
      body.paidPromotionPlan === undefined
        ? {}
        : body.paidPromotionPlan === null
          ? {
              paidPromotionPlan: null,
              paidPromotionUntil: null,
            }
          : {
              paidPromotionPlan: body.paidPromotionPlan.toUpperCase() as
                | 'WEEK'
                | 'MONTH'
                | 'YEAR',
              paidPromotionUntil: getPromotionUntil(body.paidPromotionPlan),
            }

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: {
        title: body.title.trim(),
        description: body.description.trim(),
        locationLabel: body.locationLabel.trim(),
        phone: body.phone?.trim() || null,
        websiteUrl: body.websiteUrl?.trim() || null,
        ...paidPromotionData,
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        tags: true,
        amenities: true,
        reviews: { include: { votes: true }, orderBy: { createdAt: 'desc' } },
        votes: true,
        parkingConfirmations: true,
        hostListing: true,
        communityListing: true,
      },
    } as any)

    return { item: serializeProperty(updatedProperty as any) }
  })

  app.delete('/:propertyId', async (request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const { propertyId } = request.params as { propertyId: string }
    const { actorUserId } = request.query as { actorUserId?: string }

    if (!actorUserId) {
      return reply.code(400).send({ message: 'actorUserId is required.' })
    }

    const actor = await prisma.user.findUnique({
      where: { id: actorUserId },
      select: { id: true, platformRole: true, isBanned: true },
    })

    if (!actor || actor.isBanned) {
      return reply.code(403).send({ message: 'You are not allowed to delete this property.' })
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        hostListing: true,
        communityListing: true,
      },
    })

    if (!property) {
      return reply.code(404).send({ message: 'Property not found.' })
    }

    if (
      !canManageProperty({
        actorId: actor.id,
        actorRole: actor.platformRole,
        property,
      })
    ) {
      return reply.code(403).send({ message: 'You can only delete your own properties.' })
    }

    await prisma.property.delete({
      where: { id: propertyId },
    })

    return reply.code(204).send()
  })

  app.post('/:propertyId/vote', async (request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const { propertyId } = request.params as { propertyId: string }
    const parsed = z
      .object({
        actorUserId: z.string().min(1),
        value: z.enum(['up', 'down']),
      })
      .safeParse(request.body)

    if (!parsed.success) {
      return reply.code(400).send({
        message: 'Invalid property vote payload.',
        issues: parsed.error.flatten(),
      })
    }

    const { actorUserId, value } = parsed.data
    const actor = await prisma.user.findUnique({
      where: { id: actorUserId },
      select: { id: true, isBanned: true },
    })

    if (!actor || actor.isBanned) {
      return reply.code(403).send({ message: 'You are not allowed to vote.' })
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true },
    })

    if (!property) {
      return reply.code(404).send({ message: 'Property not found.' })
    }

    const existingVote = await (prisma as any).propertyVote.findUnique({
      where: {
        propertyId_userId: {
          propertyId,
          userId: actor.id,
        },
      },
    })

    const dbValue = value.toUpperCase() as 'UP' | 'DOWN'

    if (existingVote?.value === dbValue) {
      return reply.code(409).send({
        message: `You already gave this property a ${value} vote.`,
      })
    }

    const savedVote = existingVote
      ? await (prisma as any).propertyVote.update({
          where: { id: existingVote.id },
          data: { value: dbValue },
        })
      : await (prisma as any).propertyVote.create({
          data: {
            propertyId,
            userId: actor.id,
            value: dbValue,
          },
        })

    return reply.code(existingVote ? 200 : 201).send({
      item: {
        propertyId,
        userId: actor.id,
        value: savedVote.value.toLowerCase(),
      },
    })
  })
}
