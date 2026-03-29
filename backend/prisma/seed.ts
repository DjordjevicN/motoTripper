import {
  PlatformRole,
  PrismaClient,
  PropertyListingSource,
  PropertyStatus,
} from '@prisma/client'

import { mockHostListings } from '../../frontend/src/data/hosts/mockHostListings'
import { mockProperties } from '../../frontend/src/data/properties/mockProperties'
import { mockUsers } from '../../frontend/src/data/users/mockUsers'

const prisma = new PrismaClient()

const trustTierMap = {
  unverified: 'UNVERIFIED',
  trusted: 'TRUSTED',
  'high-trust': 'HIGH_TRUST',
  elite: 'ELITE',
} as const

const ridingStyleMap = {
  touring: 'TOURING',
  sport: 'SPORT',
  adventure: 'ADVENTURE',
  commuter: 'COMMUTER',
  mixed: 'MIXED',
} as const

const experienceLevelMap = {
  beginner: 'BEGINNER',
  intermediate: 'INTERMEDIATE',
  experienced: 'EXPERIENCED',
  veteran: 'VETERAN',
} as const

const motorcycleTypeMap = {
  sport: 'SPORT',
  naked: 'NAKED',
  touring: 'TOURING',
  adventure: 'ADVENTURE',
  cruiser: 'CRUISER',
  scooter: 'SCOOTER',
  other: 'OTHER',
} as const

const tripTypeMap = {
  'day-rides': 'DAY_RIDES',
  'weekend-trips': 'WEEKEND_TRIPS',
  'multi-day-tours': 'MULTI_DAY_TOURS',
  mixed: 'MIXED',
} as const

const stopStyleMap = {
  budget: 'BUDGET',
  comfort: 'COMFORT',
  'secure-parking-first': 'SECURE_PARKING_FIRST',
  mixed: 'MIXED',
} as const

const hostListingMap = new Map(
  mockHostListings.map((listing) => [listing.propertyId, listing]),
)

const seed = async () => {
  await prisma.parkingConfirmation.deleteMany()
  await prisma.review.deleteMany()
  await prisma.communityListing.deleteMany()
  await prisma.hostListing.deleteMany()
  await prisma.propertyAmenity.deleteMany()
  await prisma.propertyTag.deleteMany()
  await prisma.propertyImage.deleteMany()
  await prisma.property.deleteMany()
  await prisma.motorcycle.deleteMany()
  await prisma.riderProfile.deleteMany()
  await prisma.user.deleteMany()

  for (const user of mockUsers) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: `${user.id}@mototripper.local`,
        name: user.name,
        avatarUrl: user.avatar,
        bio: user.bio,
        locationLabel: user.location,
        reviewCount: user.reviewCount,
        parkingConfirmationCount: user.parkingConfirmationCount,
        photoContributionCount: user.photoContributionCount,
        helpfulVotesReceived: user.helpfulVotesReceived,
        accountAgeDays: user.accountAgeDays ?? 0,
        trustScore: user.trustScore,
        trustTier: trustTierMap[user.trustTier],
        platformRole:
          user.id === 'rider-current' ? PlatformRole.ADMIN : PlatformRole.RIDER,
        xp: user.xp,
        levelLabel: user.level,
        savedPropertyIds: user.savedPropertyIds ?? [],
        savedUrgentStopPropertyIds: user.savedUrgentStopPropertyIds ?? [],
        recentViewedPropertyIds: user.recentViewedPropertyIds ?? [],
        riderProfile: {
          create: {
            ridingStyle: user.ridingStyle
              ? ridingStyleMap[user.ridingStyle]
              : undefined,
            experienceLevel: user.experienceLevel
              ? experienceLevelMap[user.experienceLevel]
              : undefined,
            typicalTripType: user.typicalTripType
              ? tripTypeMap[user.typicalTripType]
              : undefined,
            preferredStopStyle: user.preferredStopStyle
              ? stopStyleMap[user.preferredStopStyle]
              : undefined,
            memberSince: user.memberSince ? new Date(user.memberSince) : undefined,
          },
        },
        motorcycle: user.motorcycle
          ? {
              create: {
                brand: user.motorcycle.brand,
                model: user.motorcycle.model,
                year: user.motorcycle.year,
                type: user.motorcycle.type
                  ? motorcycleTypeMap[user.motorcycle.type]
                  : undefined,
                engineCc: user.motorcycle.engineCc,
              },
            }
          : undefined,
      },
    })
  }

  for (const property of mockProperties) {
    const [city, country] = property.locationLabel.split(',').map((item) => item.trim())
    const linkedHostListing = hostListingMap.get(property.id)

    await prisma.property.create({
      data: {
        id: property.id,
        title: property.title,
        description: property.description,
        locationLabel: property.locationLabel,
        city: city ?? property.locationLabel,
        country: country ?? null,
        phone: property.phone,
        websiteUrl: property.websiteUrl,
        latitude: property.coordinates.lat,
        longitude: property.coordinates.lng,
        nightlyPrice: property.nightlyPrice,
        cleaningFee: property.cleaningFee,
        serviceFee: property.serviceFee,
        rating: property.rating,
        reviewCount: property.reviewCount,
        bedrooms: property.bedrooms,
        guests: property.guests,
        verifiedRiderRecommended: property.trustSignals.verifiedRiderRecommended,
        roomsLeft: property.roomAvailability.roomsLeft,
        nextAvailableDate: property.roomAvailability.nextAvailableDate,
        sleepingArrangement: property.sleepingArrangement,
        availableTonight: property.availableTonight,
        coveredParking: property.parking.covered,
        trailerFriendly: property.parking.trailerFriendly,
        motoWashStation: property.parking.motoWashStation,
        parkingSpaces: property.parking.spaces,
        parkingSecurity: property.parking.security,
        wifiSpeedMbps: property.wifi.speedMbps,
        wifiNotes: property.wifi.notes,
        listingSource:
          property.listingSource === 'official'
            ? PropertyListingSource.OFFICIAL
            : PropertyListingSource.COMMUNITY,
        status: linkedHostListing
          ? (linkedHostListing.status.replaceAll('-', '_').toUpperCase() as PropertyStatus)
          : PropertyStatus.LIVE,
        images: {
          create: property.imageUrls.map((imageUrl, index) => ({
            url: imageUrl,
            sortOrder: index,
          })),
        },
        tags: {
          create: property.tags.map((label) => ({ label })),
        },
        amenities: {
          create: property.amenities.map((label) => ({ label })),
        },
        reviews: {
          create: property.reviews.map((review) => ({
            id: review.id,
            userId: review.userId,
            rating: review.rating,
            parkingSafetyRating: review.parkingSafetyRating,
            title: review.title,
            content: review.content,
            helpfulVotes: review.helpfulVotes,
            photos: review.photos ?? [],
            tripType: review.tripType,
            safeParkingConfirmed: review.safeParkingConfirmed ?? false,
            coveredParkingConfirmed: review.coveredParkingConfirmed ?? false,
            createdAt: new Date(review.createdAt),
          })),
        },
      },
    })
  }

  const allProperties = await prisma.property.findMany({
    include: {
      reviews: true,
    },
  })

  for (const property of mockProperties) {
    for (const review of property.reviews) {
      if (!review.safeParkingConfirmed && !review.coveredParkingConfirmed) {
        continue
      }

      await prisma.parkingConfirmation.upsert({
        where: {
          propertyId_userId: {
            propertyId: property.id,
            userId: review.userId,
          },
        },
        update: {},
        create: {
          id: `parking-${review.id}`,
          propertyId: property.id,
          userId: review.userId,
          reviewId: review.id,
          isSafe: review.safeParkingConfirmed ?? false,
          isCovered: review.coveredParkingConfirmed ?? false,
          notes: review.title,
          photoEvidenceUrl: review.photos?.[0],
          createdAt: new Date(review.createdAt),
        },
      })
    }
  }

  for (const property of mockProperties) {
    if (property.listingSource === 'community' && property.submittedByUserId) {
      await prisma.communityListing.create({
        data: {
          id: `community-${property.id}`,
          propertyId: property.id,
          submittedByUserId: property.submittedByUserId,
          sourceWebsiteUrl: property.websiteUrl,
          sourcePhone: property.phone,
          parkingNotes: property.parking.security,
          lateCheckIn: property.availableTonight,
          hasRiderPhotoProof: property.reviews.some(
            (review) => (review.photos?.length ?? 0) > 0,
          ),
        },
      })
    }
  }

  for (const listing of mockHostListings) {
    const property = allProperties.find((item) => item.id === listing.propertyId)

    if (!property) {
      continue
    }

    await prisma.hostListing.create({
      data: {
        id: listing.id,
        propertyId: listing.propertyId,
        hostUserId: listing.hostUserId,
        unitCount: listing.unitCount,
        views: listing.metrics.views,
        likes: listing.metrics.likes,
        callClicks: listing.metrics.callClicks,
        navigateClicks: listing.metrics.navigateClicks,
      },
    })
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
