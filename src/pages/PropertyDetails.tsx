import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  CircleParking,
  Mountain,
  ShieldCheck,
  Star,
  Wifi,
} from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import PropertyLocation from '@/components/properties/PropertyLocation'
import Pill from '@/components/ui/pill'
import Tag from '@/components/ui/tag'
import { mockProperties } from '@/data/properties/mockProperties'
import { mockUser } from '@/data/users/mockUser'
import { mockUsers } from '@/data/users/mockUsers'
import { getDistanceInKm } from '@/lib/distance'
import { formatCurrency } from '@/lib/helper'
import {
  calculatePropertyParkingTrust,
  deriveParkingBadges,
  getParkingBadgeVariant,
  getParkingVerificationDescription,
  getParkingVerificationLabel,
} from '@/lib/parkingTrust'
import { getAllPropertyReviews } from '@/lib/reviews'
import { getUserTrustSummary } from '@/lib/trust'

const PropertyDetails = () => {
  const { propertyId } = useParams()
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const property = mockProperties.find((item) => item.id === propertyId)

  if (!property) {
    return <Navigate to="/" replace />
  }

  const distanceInKm = getDistanceInKm(
    mockUser.location.coordinates,
    property.coordinates,
  )
  const allReviews = getAllPropertyReviews(mockProperties)
  const parkingTrust = calculatePropertyParkingTrust(property, property.reviews, mockUsers)
  const parkingBadges = deriveParkingBadges(parkingTrust)

  const totalNightlyCost =
    property.nightlyPrice + property.cleaningFee + property.serviceFee

  const goToPreviousImage = () => {
    setActiveImageIndex((current) =>
      current === 0 ? property.imageUrls.length - 1 : current - 1,
    )
  }

  const goToNextImage = () => {
    setActiveImageIndex((current) =>
      current === property.imageUrls.length - 1 ? 0 : current + 1,
    )
  }

  return (
    <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-none py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to properties
        </Link>
      </div>

      <section className="grid gap-8 xl:grid-cols-[1.45fr_0.55fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border/70 bg-card/85 p-5 shadow-[0_30px_90px_-40px_rgba(94,42,0,0.35)] backdrop-blur sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Pill>{distanceInKm.toFixed(1)} km from rider</Pill>
              <Pill variant="secondary">
                {property.roomAvailability.roomsLeft} room
                {property.roomAvailability.roomsLeft > 1 ? 's' : ''} left
              </Pill>
            </div>

            <div className="mt-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {property.title}
              </h1>
              <PropertyLocation locationLabel={property.locationLabel} />
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              {property.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Tag className={getParkingBadgeVariant(parkingTrust.verificationLevel)}>
                {getParkingVerificationLabel(parkingTrust.verificationLevel)}
              </Tag>
              {property.trustSignals.verifiedRiderRecommended ? (
                <Tag className="border-sky-500/40 bg-sky-500/10 text-sky-300">
                  Recommended by verified users
                </Tag>
              ) : null}
              {parkingBadges.slice(1).map((badge) => (
                <Tag key={badge}>{badge}</Tag>
              ))}
              {property.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>

          <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.35)]">
            <div className="relative aspect-[16/10]">
              <img
                src={property.imageUrls[activeImageIndex]}
                alt={property.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                <Pill className="bg-background/75 text-foreground backdrop-blur">
                  Photo {activeImageIndex + 1} / {property.imageUrls.length}
                </Pill>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousImage}
                    className="rounded-full bg-background/75 p-2 text-foreground backdrop-blur transition-opacity hover:opacity-80"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNextImage}
                    className="rounded-full bg-background/75 p-2 text-foreground backdrop-blur transition-opacity hover:opacity-80"
                    aria-label="Next image"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3">
              {property.imageUrls.map((imageUrl, index) => (
                <button
                  key={imageUrl}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`overflow-hidden rounded-2xl border transition ${
                    index === activeImageIndex
                      ? 'border-primary'
                      : 'border-border/70 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={`${property.title} preview ${index + 1}`}
                    className="h-24 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-[1.75rem] border border-border/70 bg-card/80 p-5">
              <div className="mb-3 flex items-center gap-2">
                <CircleParking className="size-5 text-primary" />
                <h2 className="text-xl font-semibold">Parking for motorcycles</h2>
              </div>
              <div className="mb-4 space-y-3 rounded-[1.5rem] border border-border/70 bg-background/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className={getParkingBadgeVariant(parkingTrust.verificationLevel)}>
                    {getParkingVerificationLabel(parkingTrust.verificationLevel)}
                  </Tag>
                  <Pill variant="secondary">
                    Safety score {parkingTrust.parkingSafetyScore}/100
                  </Pill>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {getParkingVerificationDescription(
                    parkingTrust.verificationLevel,
                    parkingTrust,
                  )}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-card/80 p-3 text-sm text-muted-foreground">
                    {parkingTrust.totalConfirmations} rider confirmations
                  </div>
                  <div className="rounded-2xl bg-card/80 p-3 text-sm text-muted-foreground">
                    {parkingTrust.highTrustConfirmations} high-trust or elite confirmations
                  </div>
                  <div className="rounded-2xl bg-card/80 p-3 text-sm text-muted-foreground">
                    {parkingTrust.photoEvidenceCount} parking photo evidence items
                  </div>
                  <div className="rounded-2xl bg-card/80 p-3 text-sm text-muted-foreground">
                    {parkingTrust.coveredParkingConfirmations} covered parking confirmations
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{property.parking.spaces} dedicated parking spots</p>
                <p>
                  {property.parking.covered ? 'Covered parking' : 'Open parking'}
                </p>
                <p>{property.parking.security}</p>
                <p>
                  {property.parking.motoWashStation
                    ? 'Moto wash station available'
                    : 'No wash station on site'}
                </p>
                <p>
                  {property.parking.trailerFriendly
                    ? 'Trailer friendly access'
                    : 'Best for bikes without trailer'}
                </p>
                {parkingTrust.contradictoryUnsafeSignals > 0 ? (
                  <p className="text-rose-300">
                    {parkingTrust.contradictoryUnsafeSignals} contradictory rider signal
                    {parkingTrust.contradictoryUnsafeSignals === 1 ? '' : 's'} detected.
                  </p>
                ) : null}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-border/70 bg-card/80 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Wifi className="size-5 text-primary" />
                <h2 className="text-xl font-semibold">Wi-Fi and planning setup</h2>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{property.wifi.speedMbps} Mbps average speed</p>
                <p>{property.wifi.notes}</p>
                <p>Good base for route planning, uploads, and weather checks.</p>
              </div>
            </article>
          </section>

          <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="rounded-[1.75rem] border border-border/70 bg-card/80 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Mountain className="size-5 text-primary" />
                <h2 className="text-xl font-semibold">Sleeping arrangement</h2>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                {property.sleepingArrangement.map((sleepItem) => (
                  <div
                    key={sleepItem.label}
                    className="flex items-center justify-between rounded-2xl bg-background/70 px-4 py-3"
                  >
                    <span>{sleepItem.label}</span>
                    <span className="font-medium text-foreground">
                      x{sleepItem.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-border/70 bg-card/80 p-5">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                <h2 className="text-xl font-semibold">Rider amenities</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <Tag key={amenity}>{amenity}</Tag>
                ))}
              </div>
            </article>
          </section>

          <section className="rounded-[1.75rem] border border-border/70 bg-card/80 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Reviews</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Feedback with a rider-first lens: parking, comfort, and route
                  convenience.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-background/80 px-4 py-2">
                <Star className="size-4 fill-current text-primary" />
                <span className="font-medium">{property.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({property.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {property.reviews.map((review) => (
                (() => {
                  const trustSummary = getUserTrustSummary(
                    review.userId,
                    allReviews,
                    mockUsers,
                  )

                  return (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-border/70 bg-background/70 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div>
                            <h3 className="font-medium">{review.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              <Link
                                to={`/profile/${review.userId}`}
                                className="font-medium text-foreground transition-opacity hover:opacity-80"
                              >
                                {trustSummary?.user.name ?? 'Unknown rider'}
                              </Link>{' '}
                              · {review.tripType}
                            </p>
                          </div>

                          {trustSummary ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <Link to={`/profile/${review.userId}`}>
                                <Tag className={trustSummary.badgeVariant}>
                                  Review by {trustSummary.trustLabel}
                                </Tag>
                              </Link>
                              <span className="text-xs text-muted-foreground">
                                Trust score {trustSummary.trustScore}
                              </span>
                            </div>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Pill variant="secondary">{review.rating}/5</Pill>
                          <Pill className="bg-primary/15 text-primary">
                            Parking {review.parkingSafetyRating}/5
                          </Pill>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {review.safeParkingConfirmed ? (
                          <Tag className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                            Safe parking confirmed
                          </Tag>
                        ) : null}
                        {review.coveredParkingConfirmed ? (
                          <Tag className="border-sky-500/40 bg-sky-500/10 text-sky-300">
                            Covered parking confirmed
                          </Tag>
                        ) : null}
                        {(review.photos?.length ?? 0) > 0 ? (
                          <Tag className="border-amber-500/40 bg-amber-500/10 text-amber-300">
                            {review.photos?.length} photo
                            {review.photos?.length === 1 ? '' : 's'} attached
                          </Tag>
                        ) : null}
                        <Tag>
                          {review.helpfulVotes} helpful vote
                          {review.helpfulVotes === 1 ? '' : 's'}
                        </Tag>
                      </div>

                      {trustSummary ? (
                        <p className="mt-3 text-xs text-muted-foreground">
                          {trustSummary.user.parkingConfirmationCount} parking
                          confirmations · {trustSummary.user.helpfulVotesReceived}{' '}
                          helpful votes received · member for about{' '}
                          {Math.max(
                            1,
                            Math.round(
                              (trustSummary.user.accountAgeDays ?? 0) / 30,
                            ),
                          )}{' '}
                          months
                        </p>
                      ) : null}

                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {review.content}
                      </p>
                    </article>
                  )
                })()
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="sticky top-8 rounded-[2rem] border border-border/70 bg-card/90 p-5 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price per night</p>
                  <p className="text-4xl font-semibold tracking-tight">
                    {formatCurrency(property.nightlyPrice)}
                  </p>
                </div>
                <Pill>{property.roomAvailability.nextAvailableDate}</Pill>
              </div>

              <div className="rounded-2xl bg-background/70 p-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Nightly rate</span>
                  <span>{formatCurrency(property.nightlyPrice)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>Cleaning fee</span>
                  <span>{formatCurrency(property.cleaningFee)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>Service fee</span>
                  <span>{formatCurrency(property.serviceFee)}</span>
                </div>
                <div className="mt-3 border-t border-border/70 pt-3 font-medium text-foreground">
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span>{formatCurrency(totalNightlyCost)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <h3 className="font-medium">Availability snapshot</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {property.roomAvailability.roomsLeft} room
                  {property.roomAvailability.roomsLeft > 1 ? 's' : ''} still open.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Next available check-in: {property.roomAvailability.nextAvailableDate}
                </p>
              </div>

              <button
                type="button"
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Reserve rider stay
              </button>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default PropertyDetails
