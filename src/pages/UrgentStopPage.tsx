import { useEffect, useMemo, useState } from 'react'
import { MapPin, ShieldCheck, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

import UrgentStopCard from '@/components/properties/UrgentStopCard'
import UrgentStopFilters from '@/components/properties/UrgentStopFilters'
import { mockProperties } from '@/data/properties/mockProperties'
import { mockUser } from '@/data/users/mockUser'
import { mockUsers } from '@/data/users/mockUsers'
import { calculatePropertyParkingTrust } from '@/lib/parkingTrust'
import { rankUrgentStopProperties } from '@/lib/rankUrgentStopProperties'
import type { Coordinates, UrgentStopFilters as UrgentStopFiltersType } from '@/types'

const MAX_PRICE = Math.max(...mockProperties.map((property) => property.price))
const MAX_DISTANCE = 120
const hasGeolocationSupport =
  typeof navigator !== 'undefined' && 'geolocation' in navigator

const defaultUrgentFilters: UrgentStopFiltersType = {
  maxDistance: 80,
  maxPrice: MAX_PRICE,
  verifiedParkingOnly: false,
  coveredParkingOnly: false,
  availableTonightOnly: true,
}

const UrgentStopPage = () => {
  const [filters, setFilters] =
    useState<UrgentStopFiltersType>(defaultUrgentFilters)
  const [userLocation, setUserLocation] = useState<Coordinates>(
    mockUser.location.coordinates,
  )
  const [locationLabel, setLocationLabel] = useState(mockUser.location.label)
  const [locationStatus, setLocationStatus] = useState<
    'locating' | 'current' | 'fallback' | 'mock-nearby'
  >(hasGeolocationSupport ? 'locating' : 'fallback')

  useEffect(() => {
    if (!hasGeolocationSupport) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocationLabel('your current location')
        setLocationStatus('current')
      },
      () => {
        setLocationStatus('fallback')
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
      },
    )
  }, [])

  const rankedProperties = useMemo(
    () => rankUrgentStopProperties(mockProperties, userLocation, mockUsers),
    [userLocation],
  )
  const fallbackRankedProperties = useMemo(
    () =>
      rankUrgentStopProperties(
        mockProperties,
        mockUser.location.coordinates,
        mockUsers,
      ),
    [],
  )

  const hasNearbyCurrentMatches = rankedProperties.some(
    ({ property, distanceInKm }) => property.availableTonight && distanceInKm <= MAX_DISTANCE,
  )
  const activeRankedProperties =
    locationStatus === 'current' && !hasNearbyCurrentMatches
      ? fallbackRankedProperties
      : rankedProperties
  const activeLocationLabel =
    locationStatus === 'current' && !hasNearbyCurrentMatches
      ? mockUser.location.label
      : locationLabel

  const visibleProperties = activeRankedProperties.filter(
    ({ property, distanceInKm }) => {
      if (filters.availableTonightOnly && !property.availableTonight) {
        return false
      }

      if (distanceInKm > filters.maxDistance) {
        return false
      }

      if (property.price > filters.maxPrice) {
        return false
      }

      if (
        filters.verifiedParkingOnly &&
        !calculatePropertyParkingTrust(property, property.reviews, mockUsers)
          .hasVerifiedSafeParking
      ) {
        return false
      }

      if (filters.coveredParkingOnly && !property.coveredParking) {
        return false
      }

      return true
    },
  )

  const locationStatusLabel =
    locationStatus === 'current'
      ? hasNearbyCurrentMatches
        ? 'Using your current location'
        : `Using mock nearby location: ${mockUser.location.label}`
      : locationStatus === 'mock-nearby'
        ? `Using mock nearby location: ${mockUser.location.label}`
      : locationStatus === 'fallback'
        ? `Using fallback location: ${mockUser.location.label}`
        : 'Checking your location'

  return (
    <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-none py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to home
        </Link>
      </div>

      <section className="space-y-6 rounded-[2rem] border border-border/70 bg-card/85 p-6 shadow-[0_30px_90px_-40px_rgba(94,42,0,0.35)] backdrop-blur sm:p-8">
        <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-destructive/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-red-200 ring-1 ring-destructive/20">
              <TriangleAlert className="size-4" />
              Urgent stop mode
            </span>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Need a safe stop before the light fades?
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                This view is built for tired riders making a fast decision:
                available tonight, trusted parking, and minimal friction.
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border/70 bg-background/60 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-background/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                <MapPin className="size-4 text-primary" />
                {locationStatusLabel}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                <ShieldCheck className="size-4" />
                Tonight-first ranking active
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Results are ranked around {activeLocationLabel} with parking safety
              weighted above generic travel signals.
            </p>
          </div>
        </div>

        <UrgentStopFilters
          filters={filters}
          maxDistanceLimit={MAX_DISTANCE}
          maxPriceLimit={MAX_PRICE}
          onFiltersChange={setFilters}
          onExpandSearchRadius={() =>
            setFilters((current) => ({
              ...current,
              maxDistance: Math.min(current.maxDistance + 20, MAX_DISTANCE),
            }))
          }
        />

        {visibleProperties.length > 0 ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between rounded-[1.5rem] border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted-foreground">
              <span>{visibleProperties.length} urgent stop options</span>
              <span>Available tonight is prioritized by default</span>
            </div>

            <div className="space-y-4">
              {visibleProperties.map(({ property, distanceInKm }) => (
                <UrgentStopCard
                  key={property.id}
                  property={property}
                  distanceInKm={distanceInKm}
                />
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-[1.75rem] border border-dashed border-border/80 bg-background/40 p-10 text-center">
            <h2 className="text-2xl font-semibold">No safe stop matches yet</h2>
            <p className="mt-3 text-muted-foreground">
              Try expanding the search radius or loosening the parking filters to
              surface more overnight options.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    maxDistance: Math.min(current.maxDistance + 20, MAX_DISTANCE),
                  }))
                }
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Expand search radius
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

export default UrgentStopPage
