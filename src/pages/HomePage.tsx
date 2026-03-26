import { useState } from 'react'
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Filter, SlidersHorizontal, UserRound } from 'lucide-react'

import PropertyCard from '@/components/properties/PropertyCard'
import { Button } from '@/components/ui/button'
import Pill from '@/components/ui/pill'
import { mockProperties } from '@/data/properties/mockProperties'
import { mockUser } from '@/data/users/mockUser'
import { getDistanceInKm } from '@/lib/distance'
import { formatCurrency } from '@/lib/helper'

const MIN_PRICE = Math.min(
  ...mockProperties.map((property) => property.nightlyPrice),
)
const MAX_PRICE = Math.max(
  ...mockProperties.map((property) => property.nightlyPrice),
)
const PRICE_STEP = 10

type SortMode = 'distance' | 'price-asc' | 'price-desc'

const HomePage = () => {
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)
  const [sortMode, setSortMode] = useState<SortMode>('distance')

  const visibleProperties = mockProperties
    .map((property) => ({
      property,
      distanceInKm: getDistanceInKm(
        mockUser.location.coordinates,
        property.coordinates,
      ),
    }))
    .filter(({ property }) => property.nightlyPrice <= maxPrice)
    .sort((a, b) => {
      if (sortMode === 'price-asc') {
        return a.property.nightlyPrice - b.property.nightlyPrice
      }

      if (sortMode === 'price-desc') {
        return b.property.nightlyPrice - a.property.nightlyPrice
      }

      return a.distanceInKm - b.distanceInKm
    })

  const sortLabel =
    sortMode === 'distance'
      ? 'Distance'
      : sortMode === 'price-asc'
        ? 'Price low to high'
        : 'Price high to low'

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-4xl border border-border/70 bg-card/85 p-6 shadow-[0_30px_90px_-40px_rgba(94,42,0,0.35)] backdrop-blur sm:p-8">
        <div className="flex flex-col gap-10 lg:flex-row">
          <aside className="lg:w-[320px] lg:shrink-0">
            <div className="top-8 space-y-5 rounded-[1.75rem] border border-border/70 bg-background/90 p-5 lg:sticky">
              <div className="space-y-3">
                <div className="inline-flex rounded-full bg-primary/10 p-3 text-primary">
                  <SlidersHorizontal className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    Filters
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                    Find the right stay nearby
                  </h1>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    We are currently sorting everything by distance from the
                    user and applying a price filter on the side.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-4">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <UserRound className="size-4 text-primary" />
                  Mock user
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {mockUser.firstName} {mockUser.lastName}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {mockUser.location.label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Lat {mockUser.location.coordinates.lat}, Lng{' '}
                  {mockUser.location.coordinates.lng}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Filter className="size-4 text-primary" />
                  <h2 className="text-lg font-semibold">Price</h2>
                </div>

                <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-4">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Max nightly price
                      </p>
                      <p className="mt-1 text-3xl font-semibold tracking-tight">
                        {formatCurrency(maxPrice)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMaxPrice(MAX_PRICE)}
                      className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
                    >
                      Reset
                    </button>
                  </div>

                  <input
                    type="range"
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step={PRICE_STEP}
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(Number(event.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[var(--primary)]"
                    aria-label="Maximum nightly price"
                  />

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(MIN_PRICE)}</span>
                    <span>{formatCurrency(MAX_PRICE)}</span>
                  </div>

                  <p className="text-sm leading-6 text-muted-foreground">
                    Showing properties priced at {formatCurrency(maxPrice)} per
                    night or less.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-5">
            <div className="flex flex-col gap-3 rounded-[1.75rem] border border-border/70 bg-background/80 p-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Nearby properties
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  Sort by distance or price
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Showing {visibleProperties.length} stays around{' '}
                  {mockUser.location.label}.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Pill variant="secondary" className="text-[11px]">
                  Max price: {formatCurrency(maxPrice)}
                </Pill>
                <Button
                  variant={sortMode === 'distance' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortMode('distance')}
                >
                  Distance
                </Button>
                <Button
                  variant={sortMode === 'price-asc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortMode('price-asc')}
                >
                  <ArrowUpNarrowWide />
                  Price
                </Button>
                <Button
                  variant={sortMode === 'price-desc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortMode('price-desc')}
                >
                  <ArrowDownNarrowWide />
                  Price
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 px-4 py-3 text-sm text-muted-foreground">
              <span>Current sort</span>
              <span className="font-medium text-foreground">{sortLabel}</span>
            </div>

            {visibleProperties.length > 0 ? (
              <div className="space-y-4">
                {visibleProperties.map(({ property, distanceInKm }) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    distanceInKm={distanceInKm}
                  />
                ))}
              </div>
            ) : (
              <section className="rounded-[1.75rem] border border-dashed border-border/80 bg-card/70 p-10 text-center">
                <h3 className="text-xl font-semibold">
                  No properties match yet
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Try another price range and the list will repopulate.
                </p>
              </section>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
