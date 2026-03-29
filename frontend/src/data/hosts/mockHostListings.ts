import type { HostPropertyListing } from '@/types'

export const mockHostListings: HostPropertyListing[] = [
  {
    id: 'host-listing-1',
    hostUserId: 'rider-current',
    propertyId: 'prop-7',
    propertyTitle: 'Late Check-In Moto Lodge',
    location: 'Mladenovac, Serbia',
    coverImage:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    unitCount: 4,
    status: 'live',
    nightlyPrice: 96,
    availableTonight: true,
    metrics: {
      views: 1824,
      likes: 96,
      reviewCount: 2,
      callClicks: 38,
      navigateClicks: 71,
    },
    recentReviewIds: ['review-8', 'review-13'],
  },
  {
    id: 'host-listing-2',
    hostUserId: 'rider-current',
    propertyId: 'prop-2',
    propertyTitle: 'City Loft with Garage',
    location: 'Zemun, Belgrade',
    coverImage:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    unitCount: 2,
    status: 'live',
    nightlyPrice: 188,
    availableTonight: true,
    metrics: {
      views: 1260,
      likes: 54,
      reviewCount: 3,
      callClicks: 19,
      navigateClicks: 44,
    },
    recentReviewIds: ['review-3', 'review-12', 'review-15'],
  },
  {
    id: 'host-listing-3',
    hostUserId: 'rider-current',
    propertyId: 'draft-courtyard-stay',
    propertyTitle: 'Rider Courtyard Stay',
    location: 'Belgrade, Serbia',
    coverImage:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    unitCount: 3,
    status: 'draft',
    nightlyPrice: 85,
    availableTonight: false,
    metrics: {
      views: 0,
      likes: 0,
      reviewCount: 0,
      callClicks: 0,
      navigateClicks: 0,
    },
    recentReviewIds: [],
  },
]
