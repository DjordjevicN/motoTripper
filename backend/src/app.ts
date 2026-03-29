import cors from '@fastify/cors'
import sensible from '@fastify/sensible'
import Fastify from 'fastify'

import { env } from './config/env.js'
import { healthRoutes } from './modules/health/routes.js'
import { bootstrapRoutes } from './modules/bootstrap/routes.js'
import { listingRoutes } from './modules/listings/routes.js'
import { parkingConfirmationRoutes } from './modules/parking-confirmations/routes.js'
import { propertyRoutes } from './modules/properties/routes.js'
import { reviewRoutes } from './modules/reviews/routes.js'
import { userRoutes } from './modules/users/routes.js'

export const buildApp = () => {
  const app = Fastify({
    logger: env.nodeEnv === 'development',
  })

  app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
  app.register(sensible)

  app.register(async (api) => {
    api.get('/', async () => ({
      name: 'MotoTripper API',
      status: 'ready',
    }))

    api.register(bootstrapRoutes, { prefix: '/bootstrap' })
    api.register(healthRoutes, { prefix: '/health' })
    api.register(userRoutes, { prefix: '/users' })
    api.register(propertyRoutes, { prefix: '/properties' })
    api.register(reviewRoutes, { prefix: '/reviews' })
    api.register(parkingConfirmationRoutes, { prefix: '/parking-confirmations' })
    api.register(listingRoutes, { prefix: '/listings' })
  }, { prefix: '/api' })

  return app
}
