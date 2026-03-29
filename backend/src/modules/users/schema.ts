import { z } from 'zod'

const normalizedText = (max: number) =>
  z.string().max(max).transform((value) => value.trim())

export const createUserSchema = z.object({
  email: z.email(),
  name: z.string().min(1).max(120),
})

export const updateUserProfileSchema = z.object({
  email: z.email(),
  name: z.string().min(1).max(120),
  location: normalizedText(160),
  bio: normalizedText(1000),
  ridingStyle: z.enum(['touring', 'sport', 'adventure', 'commuter', 'mixed']),
  experienceLevel: z.enum([
    'beginner',
    'intermediate',
    'experienced',
    'veteran',
  ]),
  typicalTripType: z.enum([
    'day-rides',
    'weekend-trips',
    'multi-day-tours',
    'mixed',
  ]),
  preferredStopStyle: z.enum([
    'budget',
    'comfort',
    'secure-parking-first',
    'mixed',
  ]),
  motorcycle: z.object({
    brand: normalizedText(120),
    model: normalizedText(120),
    year: z.number().int().min(1900).max(2100).optional(),
    type: z.enum([
      'sport',
      'naked',
      'touring',
      'adventure',
      'cruiser',
      'scooter',
      'other',
    ]),
    engineCc: z.number().int().min(50).max(3000).optional(),
  }),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>
