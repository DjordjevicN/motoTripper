import type { Coordinates } from '@/types'

export const CURRENT_USER_ID = 'rider-current'

export const FALLBACK_USER_LOCATION: {
  label: string
  coordinates: Coordinates
} = {
  label: 'Dorcol, Belgrade',
  coordinates: {
    lat: 44.8232,
    lng: 20.4597,
  },
}
