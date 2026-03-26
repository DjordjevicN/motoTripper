export type Coordinates = {
  lat: number
  lng: number
}

export type Property = {
  id: string
  title: string
  locationLabel: string
  coordinates: Coordinates
  nightlyPrice: number
  rating: number
  reviewCount: number
  bedrooms: number
  guests: number
  tags: string[]
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
