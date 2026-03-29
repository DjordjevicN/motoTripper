import { ChevronLeft, Eye, Heart, MapPinned, PhoneCall, Route } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

import HostListingCard from '@/components/host/HostListingCard'
import HostMetricCard from '@/components/host/HostMetricCard'
import { mockHostListings } from '@/data/hosts/mockHostListings'
import { mockCurrentUserId, mockUsers } from '@/data/users/mockUsers'

const HostDashboardPage = () => {
  const [searchParams] = useSearchParams()
  const host = mockUsers.find((user) => user.id === mockCurrentUserId)
  const listings = mockHostListings.filter(
    (listing) => listing.hostUserId === mockCurrentUserId,
  )

  const totals = listings.reduce(
    (accumulator, listing) => ({
      views: accumulator.views + listing.metrics.views,
      likes: accumulator.likes + listing.metrics.likes,
      reviews: accumulator.reviews + listing.metrics.reviewCount,
      calls: accumulator.calls + listing.metrics.callClicks,
      navigates: accumulator.navigates + listing.metrics.navigateClicks,
    }),
    {
      views: 0,
      likes: 0,
      reviews: 0,
      calls: 0,
      navigates: 0,
    },
  )

  return (
    <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-none py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/landing"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to landing
        </Link>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/host/onboarding"
            className="inline-flex h-10 items-center justify-center rounded-md border border-border/70 bg-background px-4 text-sm font-medium"
          >
            Add another property
          </Link>
        </div>
      </div>

      <section className="space-y-6">
        <section className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)] sm:p-8">
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Host dashboard
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Manage multiple rider-friendly properties from one place
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                See how riders interact with your listings, monitor reviews, and
                keep improving the details that matter most: parking clarity,
                arrival confidence, and practical overnight readiness.
              </p>
              {host ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  Logged in as {host.name} · {listings.length} active or draft listings
                </p>
              ) : null}
            </div>

            {searchParams.get('created') ? (
              <div className="rounded-[1.75rem] border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm leading-7 text-emerald-300">
                Your mock onboarding draft has been added to the dashboard. In a real
                backend flow, this is where the new listing would appear for review,
                editing, and publishing.
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-amber-500/25 bg-amber-500/10 p-5 text-sm leading-7 text-amber-100/90">
                Hosts can manage multiple properties or units here. The dashboard is
                designed to show what rider demand actually looks like, not just raw
                bookings later.
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <HostMetricCard label="Total views" value={totals.views} />
          <HostMetricCard label="Likes" value={totals.likes} />
          <HostMetricCard label="Reviews" value={totals.reviews} />
          <HostMetricCard label="Call clicks" value={totals.calls} />
          <HostMetricCard label="Navigate clicks" value={totals.navigates} />
        </section>

        <section className="grid gap-4 xl:grid-cols-4">
          <article className="rounded-[1.5rem] border border-border/70 bg-card/85 p-5">
            <div className="flex items-center gap-2">
              <Eye className="size-5 text-primary" />
              <h2 className="text-lg font-semibold">Visibility</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              See which listings riders are discovering most often.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-border/70 bg-card/85 p-5">
            <div className="flex items-center gap-2">
              <Heart className="size-5 text-primary" />
              <h2 className="text-lg font-semibold">Saved interest</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Likes help show which properties riders are considering for later trips.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-border/70 bg-card/85 p-5">
            <div className="flex items-center gap-2">
              <PhoneCall className="size-5 text-primary" />
              <h2 className="text-lg font-semibold">Direct contact</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Call clicks show when riders want reassurance before arriving.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-border/70 bg-card/85 p-5">
            <div className="flex items-center gap-2">
              <Route className="size-5 text-primary" />
              <h2 className="text-lg font-semibold">Intent to arrive</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Navigate clicks are a strong signal that your listing is helping riders decide.
            </p>
          </article>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPinned className="size-5 text-primary" />
            <h2 className="text-2xl font-semibold">Your properties and units</h2>
          </div>

          <div className="space-y-5">
            {listings.map((listing) => (
              <HostListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

export default HostDashboardPage
