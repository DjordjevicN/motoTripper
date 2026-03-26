import type { Property, PropertyReview } from '@/types'

export const getAllPropertyReviews = (
  properties: Property[],
): PropertyReview[] => {
  return properties.flatMap((property) => property.reviews)
}

export const getReviewsForProperty = (
  propertyId: string,
  reviews: PropertyReview[],
): PropertyReview[] => {
  return reviews.filter((review) => review.propertyId === propertyId)
}
