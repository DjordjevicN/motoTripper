import type {
  PropertyReview,
  TrustTier,
  User,
  UserContributionStats,
  UserTrustSummary,
} from '@/types'

const REVIEW_WEIGHT = 28
const PARKING_WEIGHT = 26
const PHOTO_WEIGHT = 18
const HELPFUL_WEIGHT = 20
const CONSISTENCY_WEIGHT = 5
const ACCOUNT_AGE_WEIGHT = 3

export const applyDiminishingReturns = (
  value: number,
  cap: number,
  factor = 0.65,
) => {
  if (value <= 0) {
    return 0
  }

  if (value <= cap) {
    return value
  }

  return cap + Math.pow(value - cap, factor)
}

const normalizeScore = (value: number, maxValue: number, weight: number) => {
  if (maxValue <= 0) {
    return 0
  }

  return Math.min(weight, (value / maxValue) * weight)
}

export const getUserContributionStats = (
  userId: string,
  reviews: PropertyReview[],
): UserContributionStats => {
  const userReviews = reviews.filter((review) => review.userId === userId)
  const activeMonths = new Set(
    userReviews.map((review) => review.createdAt.slice(0, 7)),
  ).size

  return {
    totalReviews: userReviews.length,
    parkingConfirmationReviews: userReviews.filter(
      (review) =>
        review.safeParkingConfirmed === true ||
        review.coveredParkingConfirmed === true,
    ).length,
    photoBackedReviews: userReviews.filter(
      (review) => (review.photos?.length ?? 0) > 0,
    ).length,
    helpfulVotesFromReviews: userReviews.reduce(
      (total, review) => total + review.helpfulVotes,
      0,
    ),
    activeMonths,
  }
}

export const deriveTrustTier = (score: number): TrustTier => {
  if (score >= 75) {
    return 'elite'
  }

  if (score >= 50) {
    return 'high-trust'
  }

  if (score >= 25) {
    return 'trusted'
  }

  return 'unverified'
}

export const getTrustLabel = (tier: TrustTier) => {
  switch (tier) {
    case 'elite':
      return 'Elite Rider'
    case 'high-trust':
      return 'High Trust Rider'
    case 'trusted':
      return 'Trusted Rider'
    default:
      return 'Unverified Rider'
  }
}

export const getTrustDescription = (tier: TrustTier) => {
  switch (tier) {
    case 'elite':
      return 'Consistently trusted by the community with strong parking evidence, useful reviews, and repeat contribution history.'
    case 'high-trust':
      return 'A proven rider contributor whose reviews and parking confirmations carry strong weight on practical stay decisions.'
    case 'trusted':
      return 'A solid contributor with enough useful review history to help other riders decide faster.'
    default:
      return 'Still building track record. Their reviews may help, but they do not carry much authority yet.'
  }
}

export const getTrustBadgeVariant = (tier: TrustTier) => {
  switch (tier) {
    case 'elite':
      return 'border-amber-500/40 bg-amber-500/10 text-amber-300'
    case 'high-trust':
      return 'border-sky-500/40 bg-sky-500/10 text-sky-300'
    case 'trusted':
      return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
    default:
      return 'border-border/70 bg-background/70 text-muted-foreground'
  }
}

export const calculateUserTrustScore = (
  user: User,
  userReviews: PropertyReview[],
) => {
  const stats = getUserContributionStats(user.id, userReviews)

  const effectiveReviewCount = Math.max(user.reviewCount, stats.totalReviews)
  const effectiveParkingConfirmations = Math.max(
    user.parkingConfirmationCount,
    stats.parkingConfirmationReviews,
  )
  const effectivePhotoContributions = Math.max(
    user.photoContributionCount,
    stats.photoBackedReviews,
  )
  const effectiveHelpfulVotes = Math.max(
    user.helpfulVotesReceived,
    stats.helpfulVotesFromReviews,
  )

  const reviewScore = normalizeScore(
    applyDiminishingReturns(effectiveReviewCount, 10),
    14,
    REVIEW_WEIGHT,
  )
  const parkingScore = normalizeScore(
    applyDiminishingReturns(effectiveParkingConfirmations, 8),
    11,
    PARKING_WEIGHT,
  )
  const photoScore = normalizeScore(
    applyDiminishingReturns(effectivePhotoContributions, 6),
    9,
    PHOTO_WEIGHT,
  )
  const helpfulScore = normalizeScore(
    applyDiminishingReturns(effectiveHelpfulVotes, 24, 0.55),
    32,
    HELPFUL_WEIGHT,
  )
  const consistencyScore = normalizeScore(
    applyDiminishingReturns(stats.activeMonths, 6),
    8,
    CONSISTENCY_WEIGHT,
  )
  const accountAgeScore = normalizeScore(
    applyDiminishingReturns((user.accountAgeDays ?? 0) / 120, 5),
    7,
    ACCOUNT_AGE_WEIGHT,
  )

  let score = Math.round(
    reviewScore +
      parkingScore +
      photoScore +
      helpfulScore +
      consistencyScore +
      accountAgeScore,
  )

  // Newer riders need more consistency before their influence grows.
  if ((user.accountAgeDays ?? 0) < 60 && effectiveReviewCount < 4) {
    score = Math.min(score, 24)
  } else if ((user.accountAgeDays ?? 0) < 120 && effectiveReviewCount < 6) {
    score = Math.min(score, 40)
  }

  return Math.max(0, Math.min(100, score))
}

export const enrichUsersWithTrust = (
  users: User[],
  reviews: PropertyReview[],
): User[] => {
  return users.map((user) => {
    const trustScore = calculateUserTrustScore(user, reviews)

    return {
      ...user,
      trustScore,
      trustTier: deriveTrustTier(trustScore),
    }
  })
}

export const getUserTrustSummary = (
  userId: string,
  reviews: PropertyReview[],
  users: User[],
): UserTrustSummary | null => {
  const user = users.find((item) => item.id === userId)

  if (!user) {
    return null
  }

  const trustScore = calculateUserTrustScore(user, reviews)
  const trustTier = deriveTrustTier(trustScore)
  const stats = getUserContributionStats(userId, reviews)

  return {
    user: {
      ...user,
      trustScore,
      trustTier,
    },
    stats,
    trustScore,
    trustTier,
    trustLabel: getTrustLabel(trustTier),
    badgeVariant: getTrustBadgeVariant(trustTier),
  }
}
