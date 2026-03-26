import { Star } from 'lucide-react'

import PropertyCardAction from '@/components/properties/PropertyCardAction'
import PropertyLocation from '@/components/properties/PropertyLocation'
import Pill from '@/components/ui/pill'
import Tag from '@/components/ui/tag'
import type { Property } from '@/types'

type PropertyCardProps = {
  property: Property
  distanceInKm: number
  actionLabel?: string
  onAction?: (property: Property) => void
}

const PropertyCard = ({
  property,
  distanceInKm,
  actionLabel = 'Reserve',
  onAction,
}: PropertyCardProps) => {
  return (
    <article className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur transition-transform hover:-translate-y-0.5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
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

          <div className="flex flex-wrap gap-2">
            {property.tags.map((tag) => (
              <Tag key={tag}>
                {tag}
              </Tag>
            ))}
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
            <p>{property.bedrooms} bedrooms</p>
            <p>{property.guests} guests</p>
            <p className="flex items-center gap-1.5">
              <Star className="size-4 fill-current text-primary" />
              {property.rating} ({property.reviewCount} reviews)
            </p>
          </div>
        </div>

        <PropertyCardAction
          property={property}
          actionLabel={actionLabel}
          onAction={onAction}
        />
      </div>
    </article>
  )
}

export default PropertyCard
