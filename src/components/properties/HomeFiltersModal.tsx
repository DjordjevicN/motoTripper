import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { PropertyFilters } from '@/types'

type HomeFiltersModalProps = {
  isOpen: boolean
  filters: PropertyFilters
  onClose: () => void
  onFiltersChange: (filters: PropertyFilters) => void
  onReset: () => void
}

const HomeFiltersModal = ({
  isOpen,
  filters,
  onClose,
  onFiltersChange,
  onReset,
}: HomeFiltersModalProps) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-[2rem] border border-border/70 bg-card p-6 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              More filters
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Tune the stay to the ride
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Narrow the results by rider needs, comfort, and practical booking
              details.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border/70 bg-background/70 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-[1.5rem] border border-border/70 bg-background/60 p-5">
            <h3 className="font-semibold">Space and comfort</h3>

            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">
                Minimum guests
              </span>
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={filters.minGuests}
                onChange={(event) =>
                  onFiltersChange({
                    ...filters,
                    minGuests: Number(event.target.value),
                  })
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[var(--primary)]"
              />
              <span className="text-sm font-medium">{filters.minGuests}+ guests</span>
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">
                Minimum bedrooms
              </span>
              <input
                type="range"
                min={1}
                max={4}
                step={1}
                value={filters.minBedrooms}
                onChange={(event) =>
                  onFiltersChange({
                    ...filters,
                    minBedrooms: Number(event.target.value),
                  })
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[var(--primary)]"
              />
              <span className="text-sm font-medium">
                {filters.minBedrooms}+ bedrooms
              </span>
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">
                Minimum Wi-Fi speed
              </span>
              <input
                type="range"
                min={0}
                max={300}
                step={25}
                value={filters.minWifiSpeed}
                onChange={(event) =>
                  onFiltersChange({
                    ...filters,
                    minWifiSpeed: Number(event.target.value),
                  })
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[var(--primary)]"
              />
              <span className="text-sm font-medium">
                {filters.minWifiSpeed} Mbps or faster
              </span>
            </label>
          </div>

          <div className="space-y-4 rounded-[1.5rem] border border-border/70 bg-background/60 p-5">
            <h3 className="font-semibold">Rider essentials</h3>

            {[
              {
                key: 'coveredParkingOnly',
                label: 'Covered parking only',
              },
              {
                key: 'trailerFriendlyOnly',
                label: 'Trailer friendly',
              },
              {
                key: 'motoWashStationOnly',
                label: 'Moto wash station',
              },
              {
                key: 'onsiteVerifiedParkingOnly',
                label: 'Human-verified safe parking',
              },
              {
                key: 'verifiedRiderRecommendedOnly',
                label: 'Recommended by verified riders',
              },
              {
                key: 'availableTonightOnly',
                label: 'Available tonight',
              },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/70 px-4 py-3"
              >
                <span className="text-sm">{label}</span>
                <input
                  type="checkbox"
                  checked={filters[key as keyof PropertyFilters] as boolean}
                  onChange={(event) =>
                    onFiltersChange({
                      ...filters,
                      [key]: event.target.checked,
                    })
                  }
                  className="size-4 accent-[var(--primary)]"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onReset}>
            Reset filters
          </Button>
          <Button onClick={onClose}>Apply filters</Button>
        </div>
      </div>
    </div>
  )
}

export default HomeFiltersModal
