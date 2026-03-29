import { useQuery } from '@tanstack/react-query'

import type {
  CreateReviewPayload,
  HostPropertyListing,
  PaidPromotionPlan,
  Property,
  PropertyReview,
  User,
  VoteValue,
} from '@/types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

type AppBootstrap = {
  currentUserId: string
  users: User[]
  properties: Property[]
  hostListings: HostPropertyListing[]
}

const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`)

  if (!response.ok) {
    throw new Error(`Request failed for ${path}`)
  }

  return response.json() as Promise<T>
}

const sendJson = async <TResponse, TBody>(
  path: string,
  method: 'PUT' | 'POST' | 'PATCH',
  body: TBody,
): Promise<TResponse> => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const payload = (await response.json().catch(() => null)) as
    | { message?: string }
    | null

  if (!response.ok) {
    throw new Error(payload?.message ?? `Request failed for ${path}`)
  }

  return payload as TResponse
}

const sendWithoutBody = async (path: string, method: 'DELETE') => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
  })

  const payload = (await response.json().catch(() => null)) as
    | { message?: string }
    | null

  if (!response.ok) {
    throw new Error(payload?.message ?? `Request failed for ${path}`)
  }
}

export const getAppBootstrap = async () => {
  return fetchJson<AppBootstrap>('/api/bootstrap')
}

export type UpdateUserProfilePayload = {
  email: string
  name: string
  location: string
  bio: string
  ridingStyle: NonNullable<User['ridingStyle']>
  experienceLevel: NonNullable<User['experienceLevel']>
  typicalTripType: NonNullable<User['typicalTripType']>
  preferredStopStyle: NonNullable<User['preferredStopStyle']>
  motorcycle: {
    brand: string
    model: string
    year?: number
    type: NonNullable<NonNullable<User['motorcycle']>['type']>
    engineCc?: number
  }
}

export type CreateUserPayload = {
  email: string
  name: string
}

export const createUser = async (payload: CreateUserPayload) => {
  return sendJson<{ item: User; created: boolean }, CreateUserPayload>(
    '/api/users',
    'POST',
    payload,
  )
}

export const updateUserProfile = async (
  userId: string,
  payload: UpdateUserProfilePayload,
) => {
  return sendJson<{ item: User }, UpdateUserProfilePayload>(
    `/api/users/${userId}/profile`,
    'PUT',
    payload,
  )
}

export const updateUserModeration = async (
  userId: string,
  payload: {
    actorUserId: string
    isBanned?: boolean
    canLeaveReviews?: boolean
  },
) =>
  sendJson<{ item: User }, typeof payload>(
    `/api/users/${userId}/moderation`,
    'PATCH',
    payload,
  )

export const deleteUser = async (userId: string, actorUserId: string) =>
  sendWithoutBody(`/api/users/${userId}?actorUserId=${actorUserId}`, 'DELETE')

export const updateProperty = async (
  propertyId: string,
  payload: {
    actorUserId: string
    title: string
    description: string
    locationLabel: string
    phone?: string
    websiteUrl?: string
    paidPromotionPlan?: PaidPromotionPlan | null
  },
) =>
  sendJson<{ item: Property }, typeof payload>(
    `/api/properties/${propertyId}`,
    'PATCH',
    payload,
  )

export const deleteProperty = async (propertyId: string, actorUserId: string) =>
  sendWithoutBody(
    `/api/properties/${propertyId}?actorUserId=${actorUserId}`,
    'DELETE',
  )

export const createReview = async (payload: CreateReviewPayload) =>
  sendJson<{ item: PropertyReview }, CreateReviewPayload>(
    '/api/reviews',
    'POST',
    payload,
  )

export const deleteReview = async (reviewId: string, actorUserId: string) =>
  sendWithoutBody(`/api/reviews/${reviewId}?actorUserId=${actorUserId}`, 'DELETE')

export const voteForProperty = async (
  propertyId: string,
  payload: {
    actorUserId: string
    value: VoteValue
  },
) =>
  sendJson<{ item: { propertyId: string; userId: string; value: VoteValue } }, typeof payload>(
    `/api/properties/${propertyId}/vote`,
    'POST',
    payload,
  )

export const voteForReview = async (
  reviewId: string,
  payload: {
    actorUserId: string
    value: VoteValue
  },
) =>
  sendJson<{ item: { reviewId: string; userId: string; value: VoteValue } }, typeof payload>(
    `/api/reviews/${reviewId}/vote`,
    'POST',
    payload,
  )

export const useAppBootstrap = () =>
  useQuery({
    queryKey: ['app-bootstrap'],
    queryFn: getAppBootstrap,
  })
