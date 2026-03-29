import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import Tag from '@/components/ui/tag'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/helper'
import { getParkingVerificationLabel, calculatePropertyParkingTrust } from '@/lib/parkingTrust'
import { getAllPropertyReviews } from '@/lib/reviews'
import type { HostPropertyListing, Property, User } from '@/types'

type HostListingCardProps = {
  listing: HostPropertyListing
  properties: Property[]
  users: User[]
}

const HostListingCard = ({ listing, properties, users }: HostListingCardProps) => {
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [savedReplyId, setSavedReplyId] = useState<string | null>(null)

  const allReviews = useMemo(() => getAllPropertyReviews(properties), [properties])
  const property = properties.find((item) => item.id === listing.propertyId)
  const parkingTrust = property
    ? calculatePropertyParkingTrust(property, property.reviews, users)
    : null
  const reviews = listing.recentReviewIds
    .map((reviewId) => allReviews.find((review) => review.id === reviewId))
    .filter(Boolean)

  return (
    <article className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.45)]">
      <div className="grid gap-5 xl:grid-cols-[220px_1fr]">
        <img
          src={listing.coverImage}
          alt={listing.propertyTitle}
          className="h-48 w-full rounded-[1.5rem] object-cover"
        />

        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2">
                <Tag>{listing.status.replaceAll('-', ' ')}</Tag>
                <Tag>{listing.unitCount} units</Tag>
                {listing.isPaidPromotionActive ? (
                  <Tag className="border-amber-500/35 bg-amber-500/10 text-amber-300">
                    Paid {listing.paidPromotionPlan} promo
                  </Tag>
                ) : null}
                {parkingTrust ? (
                  <Tag className="border-amber-500/30 bg-amber-500/10 text-amber-300">
                    {getParkingVerificationLabel(parkingTrust.verificationLevel)}
                  </Tag>
                ) : null}
              </div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                {listing.propertyTitle}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {listing.location}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">Nightly price</p>
              <p className="mt-2 text-2xl font-semibold">
                {formatCurrency(listing.nightlyPrice)}
              </p>
              {listing.isPaidPromotionActive && listing.paidPromotionUntil ? (
                <p className="mt-2 text-xs text-amber-300">
                  Promo until {new Date(listing.paidPromotionUntil).toLocaleDateString()}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            <div className="rounded-2xl bg-background/60 p-3 text-sm text-muted-foreground">
              {listing.metrics.views} views
            </div>
            <div className="rounded-2xl bg-background/60 p-3 text-sm text-muted-foreground">
              {listing.metrics.likes} likes
            </div>
            <div className="rounded-2xl bg-background/60 p-3 text-sm text-muted-foreground">
              {listing.metrics.reviewCount} reviews
            </div>
            <div className="rounded-2xl bg-background/60 p-3 text-sm text-muted-foreground">
              {listing.metrics.callClicks} call clicks
            </div>
            <div className="rounded-2xl bg-background/60 p-3 text-sm text-muted-foreground">
              {listing.metrics.navigateClicks} navigate clicks
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {property ? (
              <Link to={`/properties/${property.id}`}>
                <Button variant="outline" size="sm">View listing</Button>
              </Link>
            ) : null}
            <Link to="/host/onboarding">
              <Button size="sm">Add another property</Button>
            </Link>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold">Recent rider reviews</h4>
            {reviews.length > 0 ? (
              reviews.map((review) => {
                const reviewer = users.find((user) => user.id === review!.userId)

                return (
                  <div
                    key={review!.id}
                    className="rounded-[1.5rem] border border-border/70 bg-background/60 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{review!.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {reviewer?.name ?? 'Rider'} · {review!.helpfulVotes} helpful votes
                        </p>
                      </div>
                      <Tag>{review!.parkingSafetyRating}/5 parking</Tag>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {review!.content}
                    </p>
                    <div className="mt-4 space-y-2">
                      <textarea
                        value={replyDrafts[review!.id] ?? ''}
                        onChange={(event) =>
                          setReplyDrafts((current) => ({
                            ...current,
                            [review!.id]: event.target.value,
                          }))
                        }
                        rows={3}
                        placeholder="Write a helpful response for the rider..."
                        className="w-full rounded-xl border border-border/70 bg-card px-4 py-3 text-sm"
                      />
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-muted-foreground">
                          {savedReplyId === review!.id
                            ? 'Response saved locally in this mock dashboard.'
                            : 'Mock host response tool'}
                        </span>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSavedReplyId(review!.id)}
                        >
                          Save response
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-border/70 bg-background/40 p-4 text-sm text-muted-foreground">
                No rider reviews yet. Once riders start staying here, you’ll be able
                to respond from this dashboard.
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default HostListingCard
