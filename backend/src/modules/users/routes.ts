import type { FastifyPluginAsync } from 'fastify'

import { prisma } from '../../lib/prisma.js'
import { ensureDatabase } from '../../lib/db-guard.js'
import { serializeUser } from '../../serializers/domain.js'
import {
  createUserSchema,
  type CreateUserInput,
  updateUserProfileSchema,
  type UpdateUserProfileInput,
} from './schema.js'

const ridingStyleMap = {
  touring: 'TOURING',
  sport: 'SPORT',
  adventure: 'ADVENTURE',
  commuter: 'COMMUTER',
  mixed: 'MIXED',
} as const

const experienceLevelMap = {
  beginner: 'BEGINNER',
  intermediate: 'INTERMEDIATE',
  experienced: 'EXPERIENCED',
  veteran: 'VETERAN',
} as const

const tripTypeMap = {
  'day-rides': 'DAY_RIDES',
  'weekend-trips': 'WEEKEND_TRIPS',
  'multi-day-tours': 'MULTI_DAY_TOURS',
  mixed: 'MIXED',
} as const

const stopStyleMap = {
  budget: 'BUDGET',
  comfort: 'COMFORT',
  'secure-parking-first': 'SECURE_PARKING_FIRST',
  mixed: 'MIXED',
} as const

const motorcycleTypeMap = {
  sport: 'SPORT',
  naked: 'NAKED',
  touring: 'TOURING',
  adventure: 'ADVENTURE',
  cruiser: 'CRUISER',
  scooter: 'SCOOTER',
  other: 'OTHER',
} as const

export const userRoutes: FastifyPluginAsync = async (app) => {
  app.post('/', async (request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const parsed = createUserSchema.safeParse(request.body)

    if (!parsed.success) {
      return reply.code(400).send({
        message: 'Invalid user payload.',
        issues: parsed.error.flatten(),
      })
    }

    const body: CreateUserInput = parsed.data
    const normalizedEmail = body.email.trim().toLowerCase()
    const normalizedName = body.name.trim()

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        riderProfile: true,
        motorcycle: true,
      },
    })

    if (existingUser) {
      return {
        created: false,
        item: serializeUser(existingUser),
      }
    }

    const createdUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: normalizedName,
        riderProfile: {
          create: {
            memberSince: new Date(),
          },
        },
      },
      include: {
        riderProfile: true,
        motorcycle: true,
      },
    })

    return reply.code(201).send({
      created: true,
      item: serializeUser(createdUser),
    })
  })

  app.get('/', async (_request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const users = await prisma.user.findMany({
      include: {
        riderProfile: true,
        motorcycle: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { items: users.map(serializeUser) }
  })

  app.get('/:userId', async (request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const { userId } = request.params as { userId: string }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        riderProfile: true,
        motorcycle: true,
      },
    })

    if (!user) {
      return reply.code(404).send({ message: 'User not found.' })
    }

    return { item: serializeUser(user) }
  })

  app.put('/:userId/profile', async (request, reply) => {
    if (!ensureDatabase(reply) || !prisma) {
      return
    }

    const { userId } = request.params as { userId: string }
    const parsed = updateUserProfileSchema.safeParse(request.body)

    if (!parsed.success) {
      return reply.code(400).send({
        message: 'Invalid profile payload.',
        issues: parsed.error.flatten(),
      })
    }

    const body: UpdateUserProfileInput = parsed.data
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    })

    if (!existingUser) {
      return reply.code(404).send({ message: 'User not found.' })
    }

    if (body.email !== existingUser.email) {
      const userWithEmail = await prisma.user.findUnique({
        where: { email: body.email },
        select: { id: true },
      })

      if (userWithEmail && userWithEmail.id !== userId) {
        return reply.code(409).send({
          message: 'That email is already in use by another account.',
        })
      }
    }

    const hasMotorcycleDetails = Boolean(
      body.motorcycle.brand || body.motorcycle.model,
    )

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: body.email,
        name: body.name,
        bio: body.bio,
        locationLabel: body.location || null,
        riderProfile: {
          upsert: {
            create: {
              ridingStyle: ridingStyleMap[body.ridingStyle],
              experienceLevel: experienceLevelMap[body.experienceLevel],
              typicalTripType: tripTypeMap[body.typicalTripType],
              preferredStopStyle: stopStyleMap[body.preferredStopStyle],
            },
            update: {
              ridingStyle: ridingStyleMap[body.ridingStyle],
              experienceLevel: experienceLevelMap[body.experienceLevel],
              typicalTripType: tripTypeMap[body.typicalTripType],
              preferredStopStyle: stopStyleMap[body.preferredStopStyle],
            },
          },
        },
        motorcycle: hasMotorcycleDetails
          ? {
              upsert: {
                create: {
                  brand: body.motorcycle.brand || 'Unknown',
                  model: body.motorcycle.model || 'Unknown',
                  year: body.motorcycle.year,
                  type: motorcycleTypeMap[body.motorcycle.type],
                  engineCc: body.motorcycle.engineCc,
                },
                update: {
                  brand: body.motorcycle.brand || 'Unknown',
                  model: body.motorcycle.model || 'Unknown',
                  year: body.motorcycle.year,
                  type: motorcycleTypeMap[body.motorcycle.type],
                  engineCc: body.motorcycle.engineCc,
                },
              },
            }
          : undefined,
      },
      include: {
        riderProfile: true,
        motorcycle: true,
      },
    })

    return { item: serializeUser(updatedUser) }
  })
}
