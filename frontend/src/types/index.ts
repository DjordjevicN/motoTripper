export type Coordinates = {
  lat: number
  lng: number
}

export type TrustTier = 'unverified' | 'trusted' | 'high-trust' | 'elite'
export type PlatformRole = 'rider' | 'host' | 'admin'
export type ParkingVerificationLevel =
  | 'none'
  | 'parking-available'
  | 'rider-confirmed'
  | 'trusted-confirmed'
  | 'verified-safe-parking'
  | 'mixed-feedback'
export type RidingStyle =
  | 'touring'
  | 'sport'
  | 'adventure'
  | 'commuter'
  | 'mixed'
export type ExperienceLevel =
  | 'beginner'
  | 'intermediate'
  | 'experienced'
  | 'veteran'
export type MotorcycleType =
  | 'sport'
  | 'naked'
  | 'touring'
  | 'adventure'
  | 'cruiser'
  | 'scooter'
  | 'other'
export type TypicalTripType =
  | 'day-rides'
  | 'weekend-trips'
  | 'multi-day-tours'
  | 'mixed'
export type PreferredStopStyle =
  | 'budget'
  | 'comfort'
  | 'secure-parking-first'
  | 'mixed'
export type PropertyListingSource = 'official' | 'community'

export type PropertyReview = {
  id: string
  propertyId: string
  userId: string
  rating: number
  parkingSafetyRating: number
  title: string
  content: string
  createdAt: string
  helpfulVotes: number
  photos?: string[]
  safeParkingConfirmed?: boolean
  coveredParkingConfirmed?: boolean
  tripType: string
}

export type User = {
  id: string
  name: string
  email?: string
  avatar?: string
  location?: string
  bio?: string
  ridingStyle?: RidingStyle
  experienceLevel?: ExperienceLevel
  motorcycle?: {
    brand: string
    model: string
    year?: number
    type?: MotorcycleType
    engineCc?: number
  }
  reviewCount: number
  parkingConfirmationCount: number
  photoContributionCount: number
  helpfulVotesReceived: number
  accountAgeDays?: number
  trustScore: number
  trustTier: TrustTier
  platformRole?: PlatformRole
  xp?: number
  level?: string
  typicalTripType?: TypicalTripType
  preferredStopStyle?: PreferredStopStyle
  memberSince?: string
  savedPropertyIds?: string[]
  savedUrgentStopPropertyIds?: string[]
  recentViewedPropertyIds?: string[]
}

export type Property = {
  id: string
  title: string
  listingSource: PropertyListingSource
  location: string
  locationLabel: string
  websiteUrl?: string
  submittedByUserId?: string
  coordinates: Coordinates
  description: string
  image: string
  price: number
  nightlyPrice: number
  cleaningFee: number
  serviceFee: number
  rating: number
  reviewCount: number
  bedrooms: number
  guests: number
  tags: string[]
  imageUrls: string[]
  availableTonight: boolean
  safeParkingVerified: boolean
  coveredParking: boolean
  riderConfirmedCount: number
  phone: string
  badges?: string[]
  roomAvailability: {
    roomsLeft: number
    nextAvailableDate: string
  }
  wifi: {
    speedMbps: number
    notes: string
  }
  parking: {
    spaces: number
    covered: boolean
    security: string
    motoWashStation: boolean
    trailerFriendly: boolean
  }
  trustSignals: {
    onsiteVerifiedParking: boolean
    verifiedRiderRecommended: boolean
  }
  sleepingArrangement: {
    label: string
    quantity: number
  }[]
  amenities: string[]
  reviews: PropertyReview[]
}

export type MockUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar: string
  preferredCurrency: string
  location: {
    label: string
    coordinates: Coordinates
  }
}

export type PropertyFilters = {
  coveredParkingOnly: boolean
  trailerFriendlyOnly: boolean
  motoWashStationOnly: boolean
  onsiteVerifiedParkingOnly: boolean
  verifiedRiderRecommendedOnly: boolean
  availableTonightOnly: boolean
}

export type PropertySearch = {
  town: string
  guests: number
  rooms: number
}

export type UrgentStopFilters = {
  maxDistance: number
  maxPrice: number
  verifiedParkingOnly: boolean
  coveredParkingOnly: boolean
  availableTonightOnly: boolean
}

export type UserContributionStats = {
  totalReviews: number
  parkingConfirmationReviews: number
  photoBackedReviews: number
  helpfulVotesFromReviews: number
  activeMonths: number
}

export type UserTrustSummary = {
  user: User
  stats: UserContributionStats
  trustScore: number
  trustTier: TrustTier
  trustLabel: string
  badgeVariant: string
}

export type UserContributionItem = {
  id: string
  propertyId: string
  propertyTitle: string
  propertyLocation: string
  createdAt: string
  label: string
  detail: string
  priority: 'review' | 'parking' | 'photo'
}

export type UserProfileSummary = {
  user: User
  trustSummary: UserTrustSummary
  recentContributions: UserContributionItem[]
  savedProperties: Property[]
  savedUrgentStops: Property[]
  recentViewedProperties: Property[]
}

export type PropertyParkingTrust = {
  propertyId: string
  totalConfirmations: number
  trustedConfirmations: number
  highTrustConfirmations: number
  eliteConfirmations: number
  photoEvidenceCount: number
  coveredParkingConfirmations: number
  contradictoryUnsafeSignals: number
  parkingSafetyScore: number
  verificationLevel: ParkingVerificationLevel
  hasVerifiedSafeParking: boolean
}

export type HostOnboardingDraft = {
  propertyName: string
  location: string
  hostName: string
  hostEmail: string
  propertyType: 'apartment' | 'house' | 'guesthouse' | 'motel' | 'cabin'
  unitCount: string
  nightlyPrice: string
  availableTonight: boolean
  lateCheckIn: boolean
  parkingType: 'private-garage' | 'covered-courtyard' | 'driveway' | 'street'
  parkingSpaces: string
  coveredParking: boolean
  cameraCoverage: boolean
  gatedAccess: boolean
  trailerFriendly: boolean
  motoWashStation: boolean
  gearDryingArea: boolean
  photoProofReady: boolean
  summary: string
  standoutFeatures: string
}

export type HostListingMetrics = {
  views: number
  likes: number
  reviewCount: number
  callClicks: number
  navigateClicks: number
}

export type HostPropertyListing = {
  id: string
  hostUserId: string
  propertyId: string
  propertyTitle: string
  location: string
  coverImage: string
  unitCount: number
  status: 'live' | 'draft' | 'pending-review'
  nightlyPrice: number
  availableTonight: boolean
  metrics: HostListingMetrics
  recentReviewIds: string[]
}

export type CommunityPropertyDraft = {
  propertyName: string
  location: string
  websiteUrl: string
  phone: string
  parkingNotes: string
  summary: string
  coveredParking: boolean
  lateCheckIn: boolean
  hasRiderPhotoProof: boolean
}
