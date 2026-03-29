import { PrismaClient } from '@prisma/client'

import { hasDatabaseUrl } from '../config/env.js'

export const prisma = hasDatabaseUrl
  ? new PrismaClient({
      log: ['warn', 'error'],
    })
  : null
