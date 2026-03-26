import type {
  Property,
  PropertyReview,
  User,
  UserContributionItem,
  UserProfileSummary,
} from '@/types'
import { getTrustDescription, getUserTrustSummary } from '@/lib/trust'

const formatContributionDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export const getRecentUserContributions = (
  userId: string,
  reviews: PropertyReview[],
  properties: Property[],
): UserContributionItem[] => {
  return reviews
    .filter((review) => review.userId === userId)
    .map((review) => {
      const property = properties.find((item) => item.id === review.propertyId)
      const actions = [
        review.safeParkingConfirmed ? 'safe parking confirmed' : null,
        review.coveredParkingConfirmed ? 'covered parking confirmed' : null,
        (review.photos?.length ?? 0) > 0
          ? `${review.photos?.length} photo${review.photos?.length === 1 ? '' : 's'} uploaded`
          : null,
      ].filter(Boolean)

      return {
        id: review.id,
        propertyId: review.propertyId,
        propertyTitle: property?.title ?? 'Unknown property',
        propertyLocation: property?.locationLabel ?? 'Unknown location',
        createdAt: review.createdAt,
        label:
          review.safeParkingConfirmed || review.coveredParkingConfirmed
            ? 'Parking evidence added'
            : 'Review added',
        detail:
          actions.length > 0
            ? `${actions.join(' · ')} · ${review.helpfulVotes} helpful vote${
                review.helpfulVotes === 1 ? '' : 's'
              }`
            : `${review.helpfulVotes} helpful vote${
                review.helpfulVotes === 1 ? '' : 's'
              } · rating ${review.rating}/5`,
        priority:
          review.safeParkingConfirmed || review.coveredParkingConfirmed
            ? 'parking'
            : (review.photos?.length ?? 0) > 0
              ? 'photo'
              : 'review' as 'parking' | 'photo' | 'review',
      }
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)
}

export const getUserProfileSummary = (
  userId: string,
  users: User[],
  reviews: PropertyReview[],
  properties: Property[],
): UserProfileSummary | null => {
  const user = users.find((item) => item.id === userId)

  if (!user) {
    return null
  }

  const trustSummary = getUserTrustSummary(userId, reviews, users)

  if (!trustSummary) {
    return null
  }

  const getPropertyList = (ids?: string[]) =>
    (ids ?? [])
      .map((id) => properties.find((property) => property.id === id))
      .filter((property): property is Property => Boolean(property))

  return {
    user,
    trustSummary: {
      ...trustSummary,
      user: {
        ...trustSummary.user,
      },
    },
    recentContributions: getRecentUserContributions(userId, reviews, properties),
    savedProperties: getPropertyList(user.savedPropertyIds),
    savedUrgentStops: getPropertyList(user.savedUrgentStopPropertyIds),
    recentViewedProperties: getPropertyList(user.recentViewedPropertyIds),
  }
}

export const getContributionSupportText = (
  reviewCount: number,
  parkingConfirmationCount: number,
  helpfulVotesReceived: number,
) => {
  if (parkingConfirmationCount >= 8) {
    return `This rider has confirmed safe parking at ${parkingConfirmationCount} stays and helped other riders move faster under pressure.`
  }

  if (helpfulVotesReceived >= 20) {
    return `This rider's reviews are regularly marked helpful, which raises their influence in a trust-first community.`
  }

  return `This rider has added ${reviewCount} reviews and is still building a useful track record for the community.`
}

export { formatContributionDate, getTrustDescription }
