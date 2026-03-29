import { Link } from 'react-router-dom'

import LandingSectionHeading from '@/components/landing/LandingSectionHeading'
import Tag from '@/components/ui/tag'
import { useAppBootstrap } from '@/lib/api'
import {
  calculatePropertyParkingTrust,
  getParkingBadgeVariant,
  getParkingVerificationLabel,
} from '@/lib/parkingTrust'
import { formatCurrency } from '@/lib/helper'

const ProductPreviewSection = () => {
  const { data } = useAppBootstrap()
  const previewProperties = [...(data?.properties ?? [])]
    .sort((a, b) => {
      const aPriority = a.isPaidPromotionActive ? 1 : 0
      const bPriority = b.isPaidPromotionActive ? 1 : 0
      return bPriority - aPriority
    })
    .slice(0, 3)
  const users = data?.users ?? []
  const featuredRider = users.find((user) => user.id === 'rider-4') ?? users[0]

  if (!featuredRider || previewProperties.length === 0) {
    return null
  }

  return (
    <section className="space-y-8">
      <LandingSectionHeading
        eyebrow="Product preview"
        title="The product already looks and behaves like a rider tool, not a generic marketplace."
        description="This is the same visual language as the app itself: dense with useful signals, calm to scan, and centered around trust."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {previewProperties.map((property) => {
            const parkingTrust = calculatePropertyParkingTrust(
              property,
              property.reviews,
              users,
            )

            return (
              <Link
                key={property.id}
                to={`/properties/${property.id}`}
                className="block rounded-[1.75rem] border border-border/70 bg-card/85 p-4 shadow-[0_18px_55px_-45px_rgba(15,23,42,0.45)] transition-transform hover:-translate-y-0.5"
              >
                <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-40 w-full rounded-[1.35rem] object-cover"
                  />
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {property.isPaidPromotionActive ? (
                        <Tag className="border-amber-500/35 bg-amber-500/10 text-amber-300">
                          Promoted stay
                        </Tag>
                      ) : null}
                      <Tag
                        className={getParkingBadgeVariant(
                          parkingTrust.verificationLevel,
                        )}
                      >
                        {getParkingVerificationLabel(parkingTrust.verificationLevel)}
                      </Tag>
                      <Tag>{parkingTrust.parkingSafetyScore}/100 score</Tag>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight">
                        {property.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {property.locationLabel}
                      </p>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {parkingTrust.totalConfirmations} rider confirmations ·{' '}
                      {parkingTrust.highTrustConfirmations} high-trust ·{' '}
                      {parkingTrust.photoEvidenceCount} photo evidence
                    </p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(property.price)} / night
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="rounded-[2rem] border border-border/70 bg-card/85 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Rider trust profile
          </p>
          <div className="mt-5 flex items-center gap-4">
            <img
              src={featuredRider.avatar}
              alt={featuredRider.name}
              className="size-16 rounded-[1.25rem] border border-border/70 object-cover"
            />
            <div>
              <p className="text-xl font-semibold">{featuredRider.name}</p>
              <p className="text-sm text-muted-foreground">
                {featuredRider.location}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border/70 bg-background/60 p-4">
              <p className="text-sm text-muted-foreground">Trust score</p>
              <p className="mt-2 text-3xl font-semibold">
                {featuredRider.trustScore}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/70 bg-background/60 p-4">
              <p className="text-sm text-muted-foreground">Parking confirmations</p>
              <p className="mt-2 text-3xl font-semibold">
                {featuredRider.parkingConfirmationCount}
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            The same trust profile that helps riders decide what to believe can
            later influence review weight, property trust, and route-aware stop
            recommendations.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ProductPreviewSection
