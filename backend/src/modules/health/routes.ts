import type { FastifyPluginAsync } from 'fastify'

import { env, hasDatabaseUrl } from '../../config/env.js'

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async () => ({
    status: 'ok',
    service: 'mototripper-backend',
    environment: env.nodeEnv,
    databaseConfigured: hasDatabaseUrl,
  }))
}
