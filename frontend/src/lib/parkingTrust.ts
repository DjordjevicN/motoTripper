import { getReviewsForProperty } from '@/lib/reviews'
import type {
  ParkingVerificationLevel,
  Property,
  PropertyParkingTrust,
  PropertyReview,
  TrustTier,
  User,
} from '@/types'

const UNSAFE_SIGNAL_PATTERNS = [
  'unsafe',
  'would not leave',
  'wouldn’t leave',
  'exposed',
  'risky',
  'sketchy',
  'not leave my bike',
]

const getTrustWeight = (tier: TrustTier) => {
  switch (tier) {
    case 'elite':
      return 3.5
    case 'high-trust':
      return 2.5
    case 'trusted':
      return 1.5
    default:
      return 1
  }
}

const hasContradictoryUnsafeSignal = (review: PropertyReview) => {
  const normalizedContent = review.content.toLowerCase()

  return (
    review.parkingSafetyRating <= 2.5 ||
    UNSAFE_SIGNAL_PATTERNS.some((pattern) => normalizedContent.includes(pattern))
  )
}

const getLatestParkingReviewsByUser = (
  propertyId: string,
  reviews: PropertyReview[],
) => {
  const reviewsForProperty = getReviewsForProperty(propertyId, reviews).filter(
    (review) =>
      review.parkingSafetyRating !== undefined ||
      review.safeParkingConfirmed === true ||
      review.coveredParkingConfirmed === true ||
      (review.photos?.length ?? 0) > 0,
  )

  const latestByUser = new Map<string, PropertyReview>()

  reviewsForProperty.forEach((review) => {
    const existingReview = latestByUser.get(review.userId)

    if (
      !existingReview ||
      new Date(review.createdAt).getTime() >
        new Date(existingReview.createdAt).getTime()
    ) {
      latestByUser.set(review.userId, review)
    }
  })

  return Array.from(latestByUser.values())
}

export const getParkingReviews = (
  propertyId: string,
  reviews: PropertyReview[],
) => {
  return getLatestParkingReviewsByUser(propertyId, reviews)
}

export const deriveParkingVerificationLevel = (
  parkingTrust: Omit<PropertyParkingTrust, 'verificationLevel' | 'hasVerifiedSafeParking'>,
): ParkingVerificationLevel => {
  if (parkingTrust.contradictoryUnsafeSignals >= 2) {
    return 'mixed-feedback'
  }

  if (
    parkingTrust.totalConfirmations >= 3 &&
    parkingTrust.highTrustConfirmations >= 2 &&
    parkingTrust.photoEvidenceCount >= 1 &&
    parkingTrust.contradictoryUnsafeSignals === 0
  ) {
    return 'verified-safe-parking'
  }

  if (
    parkingTrust.totalConfirmations >= 2 &&
    parkingTrust.highTrustConfirmations >= 1
  ) {
    return 'trusted-confirmed'
  }

  if (parkingTrust.totalConfirmations >= 2) {
    return 'rider-confirmed'
  }

  if (parkingTrust.contradictoryUnsafeSignals >= 1) {
    return 'mixed-feedback'
  }

  if (parkingTrust.totalConfirmations >= 1 || parkingTrust.coveredParkingConfirmations >= 1) {
    return 'parking-available'
  }

  return 'none'
}

export const calculatePropertyParkingTrust = (
  property: Property,
  reviews: PropertyReview[],
  users: User[],
): PropertyParkingTrust => {
  const parkingReviews = getParkingReviews(property.id, reviews)

  const confirmations = parkingReviews.filter(
    (review) => review.safeParkingConfirmed === true,
  )

  const trustedConfirmations = confirmations.filter((review) => {
    const reviewer = users.find((user) => user.id === review.userId)

    return reviewer?.trustTier !== 'unverified'
  })

  const highTrustConfirmations = confirmations.filter((review) => {
    const reviewer = users.find((user) => user.id === review.userId)

    return (
      reviewer?.trustTier === 'high-trust' || reviewer?.trustTier === 'elite'
    )
  })

  const eliteConfirmations = confirmations.filter((review) => {
    const reviewer = users.find((user) => user.id === review.userId)

    return reviewer?.trustTier === 'elite'
  })

  const photoEvidenceCount = confirmations.filter(
    (review) => (review.photos?.length ?? 0) > 0,
  ).length
  const coveredParkingConfirmations = parkingReviews.filter(
    (review) => review.coveredParkingConfirmed === true,
  ).length
  const contradictoryUnsafeSignals = parkingReviews.filter(
    hasContradictoryUnsafeSignal,
  ).length

  const weightedConfirmationScore = confirmations.reduce((total, review) => {
    const reviewer = users.find((user) => user.id === review.userId)

    return total + getTrustWeight(reviewer?.trustTier ?? 'unverified')
  }, 0)

  let parkingSafetyScore = 0
  parkingSafetyScore += Math.min(confirmations.length * 12, 30)
  parkingSafetyScore += Math.min(weightedConfirmationScore * 9, 38)
  parkingSafetyScore += Math.min(photoEvidenceCount * 12, 16)
  parkingSafetyScore += Math.min(coveredParkingConfirmations * 5, 8)
  parkingSafetyScore += property.parking.spaces > 0 ? 6 : 0
  parkingSafetyScore -= contradictoryUnsafeSignals * 22

  const baseTrust = {
    propertyId: property.id,
    totalConfirmations: confirmations.length,
    trustedConfirmations: trustedConfirmations.length,
    highTrustConfirmations: highTrustConfirmations.length,
    eliteConfirmations: eliteConfirmations.length,
    photoEvidenceCount,
    coveredParkingConfirmations,
    contradictoryUnsafeSignals,
    parkingSafetyScore: Math.max(0, Math.min(100, Math.round(parkingSafetyScore))),
  }

  const verificationLevel = deriveParkingVerificationLevel(baseTrust)

  return {
    ...baseTrust,
    verificationLevel,
    hasVerifiedSafeParking: verificationLevel === 'verified-safe-parking',
  }
}

export const deriveParkingBadges = (parkingTrust: PropertyParkingTrust) => {
  const badges: string[] = []

  if (parkingTrust.verificationLevel === 'verified-safe-parking') {
    badges.push('Verified Safe Parking')
  } else if (parkingTrust.verificationLevel === 'trusted-confirmed') {
    badges.push('Confirmed by Trusted Riders')
  } else if (parkingTrust.verificationLevel === 'rider-confirmed') {
    badges.push('Confirmed by Riders')
  } else if (parkingTrust.verificationLevel === 'parking-available') {
    badges.push('Parking Available')
  } else if (parkingTrust.verificationLevel === 'mixed-feedback') {
    badges.push('Mixed Parking Feedback')
  }

  if (parkingTrust.photoEvidenceCount >= 1) {
    badges.push('Photo Verified Parking')
  }

  if (parkingTrust.coveredParkingConfirmations >= 1) {
    badges.push('Covered Parking')
  }

  return badges
}

export const getParkingVerificationLabel = (
  level: ParkingVerificationLevel,
) => {
  switch (level) {
    case 'verified-safe-parking':
      return 'Verified Safe Parking'
    case 'trusted-confirmed':
      return 'Confirmed by Trusted Riders'
    case 'rider-confirmed':
      return 'Confirmed by Riders'
    case 'parking-available':
      return 'Parking Available'
    case 'mixed-feedback':
      return 'Mixed Parking Feedback'
    default:
      return 'No Parking Evidence Yet'
  }
}

export const getParkingVerificationDescription = (
  level: ParkingVerificationLevel,
  parkingTrust: PropertyParkingTrust,
) => {
  switch (level) {
    case 'verified-safe-parking':
      return `This property earned Verified Safe Parking because ${parkingTrust.totalConfirmations} riders confirmed safe motorcycle parking, including ${parkingTrust.highTrustConfirmations} high-trust or elite riders, with photo evidence and no strong contradictions.`
    case 'trusted-confirmed':
      return `${parkingTrust.totalConfirmations} riders confirmed safe parking, including at least one high-trust or elite rider.`
    case 'rider-confirmed':
      return `${parkingTrust.totalConfirmations} riders confirmed safe parking, but it still needs stronger trust depth for full verification.`
    case 'parking-available':
      return 'Parking appears to be available, but there is not enough rider evidence yet to treat it as trusted.'
    case 'mixed-feedback':
      return 'Rider feedback about parking safety is inconsistent, so this property does not receive full verification.'
    default:
      return 'No meaningful rider parking trust data is available yet.'
  }
}

export const getParkingBadgeVariant = (level: ParkingVerificationLevel) => {
  switch (level) {
    case 'verified-safe-parking':
      return 'border-amber-500/40 bg-amber-500/10 text-amber-300'
    case 'trusted-confirmed':
      return 'border-sky-500/40 bg-sky-500/10 text-sky-300'
    case 'rider-confirmed':
      return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
    case 'mixed-feedback':
      return 'border-rose-500/40 bg-rose-500/10 text-rose-300'
    case 'parking-available':
      return 'border-border/70 bg-background/70 text-foreground'
    default:
      return 'border-border/70 bg-background/50 text-muted-foreground'
  }
}
