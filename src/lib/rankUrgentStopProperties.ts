import { getDistanceInKm } from '@/lib/distance'
import type { Coordinates, Property } from '@/types'

export type RankedUrgentStopProperty = {
  property: Property
  distanceInKm: number
  score: number
}

const SAFE_PARKING_WEIGHT = 500
const RIDER_CONFIRMATION_WEIGHT = 8
const AVAILABLE_TONIGHT_WEIGHT = 120
const COVERED_PARKING_WEIGHT = 60
const DISTANCE_WEIGHT = 4
const DISTANCE_BASELINE = 80

export const rankUrgentStopProperties = (
  properties: Property[],
  userLocation: Coordinates,
): RankedUrgentStopProperty[] => {
  return properties
    .map((property) => {
      const distanceInKm = getDistanceInKm(userLocation, property.coordinates)

      let score = 0

      if (property.safeParkingVerified) {
        score += SAFE_PARKING_WEIGHT
      }

      score += property.riderConfirmedCount * RIDER_CONFIRMATION_WEIGHT

      if (property.availableTonight) {
        score += AVAILABLE_TONIGHT_WEIGHT
      }

      if (property.coveredParking) {
        score += COVERED_PARKING_WEIGHT
      }

      score += Math.max(0, DISTANCE_BASELINE - distanceInKm * DISTANCE_WEIGHT)

      return {
        property,
        distanceInKm,
        score,
      }
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }

      if (a.distanceInKm !== b.distanceInKm) {
        return a.distanceInKm - b.distanceInKm
      }

      return a.property.price - b.property.price
    })
}
