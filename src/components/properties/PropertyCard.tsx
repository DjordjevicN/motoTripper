import { Star } from 'lucide-react'

import PropertyCardAction from '@/components/properties/PropertyCardAction'
import PropertyLocation from '@/components/properties/PropertyLocation'
import Pill from '@/components/ui/pill'
import Tag from '@/components/ui/tag'
import { mockUsers } from '@/data/users/mockUsers'
import {
  calculatePropertyParkingTrust,
  deriveParkingBadges,
  getParkingBadgeVariant,
  getParkingVerificationLabel,
} from '@/lib/parkingTrust'
import type { Property } from '@/types'

type PropertyCardProps = {
  property: Property
  distanceInKm: number
  onAction?: (property: Property) => void
}

const PropertyCard = ({
  property,
  distanceInKm,
  onAction,
}: PropertyCardProps) => {
  const parkingTrust = calculatePropertyParkingTrust(property, property.reviews, mockUsers)
  const parkingBadges = deriveParkingBadges(parkingTrust)

  const cardContent = (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-stretch xl:justify-between">
      <div className="xl:w-80 xl:shrink-0">
        <div className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/60">
          <img
            src={property.imageUrls[0]}
            alt={property.title}
            className="h-44 w-full object-cover transition-transform duration-300 hover:scale-[1.02] sm:h-48 xl:h-full"
          />
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Pill>
              {distanceInKm.toFixed(1)} km away
            </Pill>
            <Pill variant="secondary">
              {property.guests} guests
            </Pill>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {property.title}
            </h2>
            <PropertyLocation locationLabel={property.locationLabel} />
          </div>
        </div>

        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          {property.description}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Tag className={getParkingBadgeVariant(parkingTrust.verificationLevel)}>
            {getParkingVerificationLabel(parkingTrust.verificationLevel)}
          </Tag>
          <span className="text-sm text-muted-foreground">
            {parkingTrust.totalConfirmations} rider confirmation
            {parkingTrust.totalConfirmations === 1 ? '' : 's'}
            {parkingTrust.highTrustConfirmations > 0
              ? ` · ${parkingTrust.highTrustConfirmations} high-trust`
              : ''}
            {parkingTrust.photoEvidenceCount > 0
              ? ` · ${parkingTrust.photoEvidenceCount} photo verified`
              : ''}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[...parkingBadges.slice(1), ...property.tags].map((tag) => (
            <Tag key={tag}>
              {tag}
            </Tag>
          ))}
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
          <p>{property.bedrooms} bedrooms</p>
          <p>{property.guests} guests</p>
          <p>Parking score {parkingTrust.parkingSafetyScore}/100</p>
          <p className="flex items-center gap-1.5">
            <Star className="size-4 fill-current text-primary" />
            {property.rating} ({property.reviewCount} reviews)
          </p>
        </div>
      </div>

      <PropertyCardAction property={property} parkingTrust={parkingTrust} />
    </div>
  )

  if (onAction) {
    return (
      <button
        type="button"
        onClick={() => onAction(property)}
        className="block w-full cursor-pointer rounded-[1.75rem] border border-border/70 bg-card/90 p-5 text-left shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur transition-transform hover:-translate-y-0.5"
      >
        {cardContent}
      </button>
    )
  }

  return (
    <article className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur transition-transform hover:-translate-y-0.5">
      {cardContent}
    </article>
  )
}

export default PropertyCard
