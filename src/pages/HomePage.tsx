import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import HomeFilters from '@/components/properties/HomeFilters'
import PropertyCard from '@/components/properties/PropertyCard'
import PropertiesSearchBar from '@/components/properties/PropertiesSearchBar'
import PropertiesToolbar from '@/components/properties/PropertiesToolbar'
import { mockProperties } from '@/data/properties/mockProperties'
import { mockUser } from '@/data/users/mockUser'
import { getDistanceInKm } from '@/lib/distance'
import type { Property } from '@/types'
import type { PropertyFilters } from '@/types'
import type { PropertySearch } from '@/types'

const MIN_PRICE = Math.min(
  ...mockProperties.map((property) => property.nightlyPrice),
)
const MAX_PRICE = Math.max(
  ...mockProperties.map((property) => property.nightlyPrice),
)
const PRICE_STEP = 10
const MAX_DISTANCE = Math.ceil(
  Math.max(
    ...mockProperties.map((property) =>
      getDistanceInKm(mockUser.location.coordinates, property.coordinates),
    ),
  ),
)
const DISTANCE_STEP = 5

type SortMode = 'distance' | 'price-asc' | 'price-desc'

const defaultAdvancedFilters: PropertyFilters = {
  coveredParkingOnly: false,
  trailerFriendlyOnly: false,
  motoWashStationOnly: false,
  onsiteVerifiedParkingOnly: false,
  verifiedRiderRecommendedOnly: false,
  availableTonightOnly: false,
}

const defaultPropertySearch: PropertySearch = {
  town: '',
  guests: 1,
  rooms: 1,
}

const HomePage = () => {
  const navigate = useNavigate()
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)
  const [maxDistance, setMaxDistance] = useState(MAX_DISTANCE)
  const [sortMode, setSortMode] = useState<SortMode>('distance')
  const [propertySearch, setPropertySearch] = useState<PropertySearch>(
    defaultPropertySearch,
  )
  const [advancedFilters, setAdvancedFilters] = useState<PropertyFilters>(
    defaultAdvancedFilters,
  )

  const handlePropertyDetails = (property: Property) => {
    navigate(`/properties/${property.id}`)
  }

  const visibleProperties = mockProperties
    .map((property) => ({
      property,
      distanceInKm: getDistanceInKm(
        mockUser.location.coordinates,
        property.coordinates,
      ),
    }))
    .filter(({ property }) =>
      propertySearch.town.trim()
        ? property.locationLabel
            .toLowerCase()
            .includes(propertySearch.town.trim().toLowerCase())
        : true,
    )
    .filter(({ property }) => property.nightlyPrice <= maxPrice)
    .filter(({ distanceInKm }) => distanceInKm <= maxDistance)
    .filter(({ property }) => property.guests >= propertySearch.guests)
    .filter(({ property }) => property.bedrooms >= propertySearch.rooms)
    .filter(({ property }) =>
      advancedFilters.coveredParkingOnly ? property.parking.covered : true,
    )
    .filter(({ property }) =>
      advancedFilters.trailerFriendlyOnly
        ? property.parking.trailerFriendly
        : true,
    )
    .filter(({ property }) =>
      advancedFilters.motoWashStationOnly
        ? property.parking.motoWashStation
        : true,
    )
    .filter(({ property }) =>
      advancedFilters.onsiteVerifiedParkingOnly
        ? property.trustSignals.onsiteVerifiedParking
        : true,
    )
    .filter(({ property }) =>
      advancedFilters.verifiedRiderRecommendedOnly
        ? property.trustSignals.verifiedRiderRecommended
        : true,
    )
    .filter(({ property }) =>
      advancedFilters.availableTonightOnly
        ? property.availableTonight
        : true,
    )
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
    <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-none py-8">
      <section className="mb-6 rounded-[2rem] border border-amber-500/20 bg-gradient-to-r from-amber-500/12 via-background/95 to-background/95 p-6 shadow-[0_24px_70px_-40px_rgba(245,158,11,0.35)] backdrop-blur sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
              Rider-first quick decision
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Need a safe stop now?
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
              Jump straight into nearby stays ranked for secure motorcycle
              parking, tonight availability, and fast decisions when the ride has
              gone long.
            </p>
          </div>

          <Link
            to="/urgent-stop"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Open urgent stop mode
          </Link>
        </div>
      </section>

      <section className="rounded-4xl border border-border/70 bg-card/85 p-6 shadow-[0_30px_90px_-40px_rgba(94,42,0,0.35)] backdrop-blur sm:p-8 lg:h-[calc(100vh-4rem)] lg:overflow-hidden">
        <div className="flex flex-col gap-10 lg:h-full lg:flex-row">
          <aside className="lg:w-[320px] lg:shrink-0">
            <HomeFilters
              maxDistance={maxDistance}
              maxPrice={maxPrice}
              maxDistanceLimit={MAX_DISTANCE}
              minPriceLimit={MIN_PRICE}
              maxPriceLimit={MAX_PRICE}
              distanceStep={DISTANCE_STEP}
              priceStep={PRICE_STEP}
              locationLabel={mockUser.location.label}
              advancedFilters={advancedFilters}
              onMaxDistanceChange={setMaxDistance}
              onMaxPriceChange={setMaxPrice}
              onAdvancedFiltersChange={setAdvancedFilters}
              onResetDistance={() => setMaxDistance(MAX_DISTANCE)}
              onResetPrice={() => setMaxPrice(MAX_PRICE)}
              onResetAdvancedFilters={() =>
                setAdvancedFilters(defaultAdvancedFilters)
              }
            />
          </aside>

          <div className="min-w-0 flex-1 lg:h-full lg:overflow-y-auto lg:pr-3">
            <div className="space-y-5">
              <PropertiesSearchBar
                search={propertySearch}
                onSearchChange={setPropertySearch}
              />

              <PropertiesToolbar
                visibleCount={visibleProperties.length}
                locationLabel={mockUser.location.label}
                maxPrice={maxPrice}
                maxDistance={maxDistance}
                sortMode={sortMode}
                onSortChange={setSortMode}
              />

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
                      onAction={handlePropertyDetails}
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
        </div>
      </section>
    </main>
  )
}

export default HomePage
