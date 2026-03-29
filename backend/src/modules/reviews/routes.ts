import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

import { prisma } from '../../lib/prisma.js'
import { ensureDatabase } from '../../lib/db-guard.js'
import { serializeReview } from '../../serializers/domain.js'

const createReviewSchema = z.object({
  actorUserId: z.string().min(1),
  propertyId: z.string().min(1),
  title: z.string().max(160),
  content: z.string().min(10).max(2000),
  rating: z.number().min(1).max(5),
  parkingSafetyRating: z.number().min(1).max(5),
  tripType: z.string().min(1).max(120),
  safeParkingConfirmed: z.boolean(),
  coveredParkingConfirmed: z.boolean(),
})

const recalculateUserReviewStats = async (userId: string) => {
  if (!prisma) {
    return
  }

  const reviews = await prisma.review.findMany({
    where: { userId },
    select: {
      helpfulVotes: true,
      safeParkingConfirmed: true,
      photos: true,
    },
  })

  await prisma.user.update({
    where: { id: userId },
    data: {
      reviewCount: reviews.length,
      parkingConfirmationCount: reviews.filter((review) => review.safeParkingConfirmed)
        .length,
      photoContributionCount: reviews.reduce(
        (total, review) => total + review.photos.length,
        0,
      ),
      helpfulVotesReceived: reviews.reduce(
        (total, review) => total + review.helpfulVotes,
        0,
      ),
    },
  })
}

const recalculatePropertyReviewStats = async (propertyId: string) => {
  if (!prisma) {
    return
  }

  const reviews = await prisma.review.findMany({
    where: { propertyId },
    select: {
      rating: true,
    },
  })

  const reviewCount = reviews.length
  const rating =
    reviewCount > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) / reviewCount
      : 0

  await prisma.property.update({
    where: { id: propertyId },
    data: {
      reviewCount,
      rating,
    },
  })
}

export const reviewRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (_request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const reviews = await prisma.review.findMany({
      include: {
        user: true,
        property: true,
        votes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    } as any)

    return { items: (reviews as any[]).map((review) => serializeReview(review)) }
  })

  app.post('/', async (request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const parsed = createReviewSchema.safeParse(request.body)

    if (!parsed.success) {
      return reply.code(400).send({
        message: 'Invalid review payload.',
        issues: parsed.error.flatten(),
      })
    }

    const body = parsed.data
    const actor = await prisma.user.findUnique({
      where: { id: body.actorUserId },
      select: {
        id: true,
        isBanned: true,
        canLeaveReviews: true,
      },
    })

    if (!actor || actor.isBanned) {
      return reply.code(403).send({ message: 'Banned users cannot leave reviews.' })
    }

    if (!actor.canLeaveReviews) {
      return reply.code(403).send({
        message: 'Your account is currently restricted from leaving reviews.',
      })
    }

    const property = await prisma.property.findUnique({
      where: { id: body.propertyId },
      select: { id: true },
    })

    if (!property) {
      return reply.code(404).send({ message: 'Property not found.' })
    }

    const review = await prisma.review.create({
      data: {
        propertyId: body.propertyId,
        userId: actor.id,
        title: body.title.trim(),
        content: body.content.trim(),
        rating: body.rating,
        parkingSafetyRating: body.parkingSafetyRating,
        tripType: body.tripType.trim(),
        safeParkingConfirmed: body.safeParkingConfirmed,
        coveredParkingConfirmed: body.coveredParkingConfirmed,
        helpfulVotes: 0,
        photos: [],
      },
    })

    await Promise.all([
      recalculateUserReviewStats(actor.id),
      recalculatePropertyReviewStats(body.propertyId),
    ])

    return reply.code(201).send({ item: serializeReview(review) })
  })

  app.delete('/:reviewId', async (request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const { reviewId } = request.params as { reviewId: string }
    const { actorUserId } = request.query as { actorUserId?: string }

    if (!actorUserId) {
      return reply.code(400).send({ message: 'actorUserId is required.' })
    }

    const actor = await prisma.user.findUnique({
      where: { id: actorUserId },
      select: { id: true, platformRole: true },
    })

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, userId: true, propertyId: true },
    })

    if (!actor || !review) {
      return reply.code(404).send({ message: 'Review not found.' })
    }

    if (actor.platformRole !== 'ADMIN' && actor.id !== review.userId) {
      return reply.code(403).send({ message: 'You cannot delete this review.' })
    }

    await prisma.review.delete({
      where: { id: reviewId },
    })

    await Promise.all([
      recalculateUserReviewStats(review.userId),
      recalculatePropertyReviewStats(review.propertyId),
    ])

    return reply.code(204).send()
  })

  app.post('/:reviewId/vote', async (request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const { reviewId } = request.params as { reviewId: string }
    const parsed = z
      .object({
        actorUserId: z.string().min(1),
        value: z.enum(['up', 'down']),
      })
      .safeParse(request.body)

    if (!parsed.success) {
      return reply.code(400).send({
        message: 'Invalid review vote payload.',
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

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true },
    })

    if (!review) {
      return reply.code(404).send({ message: 'Review not found.' })
    }

    const existingVote = await (prisma as any).reviewVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId: actor.id,
        },
      },
    })

    const dbValue = value.toUpperCase() as 'UP' | 'DOWN'

    if (existingVote?.value === dbValue) {
      return reply.code(409).send({
        message: `You already gave this review a ${value} vote.`,
      })
    }

    const savedVote = existingVote
      ? await (prisma as any).reviewVote.update({
          where: { id: existingVote.id },
          data: { value: dbValue },
        })
      : await (prisma as any).reviewVote.create({
          data: {
            reviewId,
            userId: actor.id,
            value: dbValue,
          },
        })

    return reply.code(existingVote ? 200 : 201).send({
      item: {
        reviewId,
        userId: actor.id,
        value: savedVote.value.toLowerCase(),
      },
    })
  })
}
