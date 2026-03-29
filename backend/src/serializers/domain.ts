import type {
  CommunityListing,
  HostListing,
  Motorcycle,
  ParkingConfirmation,
  Prisma,
  Property,
  PropertyAmenity,
  PropertyImage,
  PropertyTag,
  Review,
  RiderProfile,
  User,
} from '@prisma/client'

const toKebabCase = (value?: string | null) =>
  value ? value.toLowerCase().replaceAll('_', '-') : undefined

const toIsoDate = (value: Date | null | undefined) =>
  value ? value.toISOString().slice(0, 10) : undefined

type UserWithRelations = User & {
  riderProfile: RiderProfile | null
  motorcycle: Motorcycle | null
}

type PropertyWithRelations = Property & {
  images: PropertyImage[]
  tags: PropertyTag[]
  amenities: PropertyAmenity[]
  reviews: Review[]
  parkingConfirmations?: ParkingConfirmation[]
  communityListing: CommunityListing | null
  hostListing: HostListing | null
}

type HostListingWithRelations = HostListing & {
  property: Property & {
    images: PropertyImage[]
    reviews: Review[]
  }
}

const parseSleepingArrangement = (
  value: Prisma.JsonValue | null,
): { label: string; quantity: number }[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => {
      if (
        typeof item === 'object' &&
        item !== null &&
        'label' in item &&
        'quantity' in item &&
        typeof item.label === 'string' &&
        typeof item.quantity === 'number'
      ) {
        return {
          label: item.label,
          quantity: item.quantity,
        }
      }

      return null
    })
    .filter((item): item is { label: string; quantity: number } => Boolean(item))
}

export const serializeUser = (user: UserWithRelations) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatarUrl ?? undefined,
  location: user.locationLabel ?? undefined,
  bio: user.bio ?? undefined,
  ridingStyle: user.riderProfile?.ridingStyle
    ? toKebabCase(user.riderProfile.ridingStyle)
    : undefined,
  experienceLevel: user.riderProfile?.experienceLevel
    ? toKebabCase(user.riderProfile.experienceLevel)
    : undefined,
  motorcycle: user.motorcycle
    ? {
        brand: user.motorcycle.brand,
        model: user.motorcycle.model,
        year: user.motorcycle.year ?? undefined,
        type: user.motorcycle.type ? toKebabCase(user.motorcycle.type) : undefined,
        engineCc: user.motorcycle.engineCc ?? undefined,
      }
    : undefined,
  reviewCount: user.reviewCount,
  parkingConfirmationCount: user.parkingConfirmationCount,
  photoContributionCount: user.photoContributionCount,
  helpfulVotesReceived: user.helpfulVotesReceived,
  accountAgeDays: user.accountAgeDays ?? undefined,
  trustScore: user.trustScore,
  trustTier: toKebabCase(user.trustTier) ?? 'unverified',
  platformRole: toKebabCase(user.platformRole) ?? 'rider',
  xp: user.xp ?? undefined,
  level: user.levelLabel ?? undefined,
  typicalTripType: user.riderProfile?.typicalTripType
    ? toKebabCase(user.riderProfile.typicalTripType)
    : undefined,
  preferredStopStyle: user.riderProfile?.preferredStopStyle
    ? toKebabCase(user.riderProfile.preferredStopStyle)
    : undefined,
  memberSince: toIsoDate(user.riderProfile?.memberSince) ?? undefined,
  savedPropertyIds: user.savedPropertyIds,
  savedUrgentStopPropertyIds: user.savedUrgentStopPropertyIds,
  recentViewedPropertyIds: user.recentViewedPropertyIds,
})

export const serializeReview = (review: Review) => ({
  id: review.id,
  propertyId: review.propertyId,
  userId: review.userId,
  rating: review.rating,
  parkingSafetyRating: review.parkingSafetyRating ?? 0,
  title: review.title ?? '',
  content: review.content,
  createdAt: review.createdAt.toISOString().slice(0, 10),
  helpfulVotes: review.helpfulVotes,
  photos: review.photos,
  safeParkingConfirmed: review.safeParkingConfirmed,
  coveredParkingConfirmed: review.coveredParkingConfirmed,
  tripType: review.tripType ?? '',
})

export const serializeProperty = (property: PropertyWithRelations) => ({
  id: property.id,
  title: property.title,
  listingSource: toKebabCase(property.listingSource),
  location: property.locationLabel,
  locationLabel: property.locationLabel,
  websiteUrl:
    property.listingSource === 'COMMUNITY'
      ? property.communityListing?.sourceWebsiteUrl ?? property.websiteUrl ?? undefined
      : property.websiteUrl ?? undefined,
  submittedByUserId:
    property.listingSource === 'COMMUNITY'
      ? property.communityListing?.submittedByUserId ?? undefined
      : undefined,
  coordinates: {
    lat: property.latitude,
    lng: property.longitude,
  },
  description: property.description,
  image: property.images[0]?.url ?? '',
  price: Number(property.nightlyPrice),
  nightlyPrice: Number(property.nightlyPrice),
  cleaningFee: Number(property.cleaningFee),
  serviceFee: Number(property.serviceFee),
  rating: property.rating,
  reviewCount: property.reviewCount,
  bedrooms: property.bedrooms,
  guests: property.guests,
  tags: property.tags.map((tag) => tag.label),
  imageUrls: property.images.map((image) => image.url),
  availableTonight: property.availableTonight,
  safeParkingVerified: (property.parkingConfirmations?.length ?? 0) >= 3,
  coveredParking: property.coveredParking,
  riderConfirmedCount: property.parkingConfirmations?.filter((item) => item.isSafe).length ?? 0,
  phone:
    property.listingSource === 'COMMUNITY'
      ? property.communityListing?.sourcePhone ?? property.phone ?? ''
      : property.phone ?? '',
  roomAvailability: {
    roomsLeft: property.roomsLeft,
    nextAvailableDate: property.nextAvailableDate ?? '',
  },
  wifi: {
    speedMbps: property.wifiSpeedMbps ?? 0,
    notes: property.wifiNotes ?? '',
  },
  parking: {
    spaces: property.parkingSpaces,
    covered: property.coveredParking,
    security: property.parkingSecurity ?? '',
    motoWashStation: property.motoWashStation,
    trailerFriendly: property.trailerFriendly,
  },
  trustSignals: {
    onsiteVerifiedParking: (property.parkingConfirmations?.length ?? 0) >= 3,
    verifiedRiderRecommended: property.verifiedRiderRecommended,
  },
  sleepingArrangement: parseSleepingArrangement(property.sleepingArrangement),
  amenities: property.amenities.map((amenity) => amenity.label),
  reviews: property.reviews.map(serializeReview),
})

export const serializeHostListing = (listing: HostListingWithRelations) => ({
  id: listing.id,
  hostUserId: listing.hostUserId,
  propertyId: listing.propertyId,
  propertyTitle: listing.property.title,
  location: listing.property.locationLabel,
  coverImage: listing.property.images[0]?.url ?? '',
  unitCount: listing.unitCount,
  status: toKebabCase(listing.property.status),
  nightlyPrice: Number(listing.property.nightlyPrice),
  availableTonight: listing.property.availableTonight,
  metrics: {
    views: listing.views,
    likes: listing.likes,
    reviewCount: listing.property.reviewCount,
    callClicks: listing.callClicks,
    navigateClicks: listing.navigateClicks,
  },
  recentReviewIds: listing.property.reviews
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3)
    .map((review) => review.id),
})
