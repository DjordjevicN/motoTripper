export type Coordinates = {
  lat: number
  lng: number
}

export type Property = {
  id: string
  title: string
  locationLabel: string
  coordinates: Coordinates
  description: string
  nightlyPrice: number
  cleaningFee: number
  serviceFee: number
  rating: number
  reviewCount: number
  bedrooms: number
  guests: number
  tags: string[]
  imageUrls: string[]
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
  reviews: {
    id: string
    author: string
    rating: number
    title: string
    comment: string
    tripType: string
  }[]
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
  minGuests: number
  minBedrooms: number
  minWifiSpeed: number
  coveredParkingOnly: boolean
  trailerFriendlyOnly: boolean
  motoWashStationOnly: boolean
  onsiteVerifiedParkingOnly: boolean
  verifiedRiderRecommendedOnly: boolean
  availableTonightOnly: boolean
}
