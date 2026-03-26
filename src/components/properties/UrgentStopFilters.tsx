import { ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Pill from '@/components/ui/pill'
import { formatCurrency } from '@/lib/helper'
import type { UrgentStopFilters as UrgentStopFiltersType } from '@/types'

type UrgentStopFiltersProps = {
  filters: UrgentStopFiltersType
  maxDistanceLimit: number
  maxPriceLimit: number
  onFiltersChange: (filters: UrgentStopFiltersType) => void
  onExpandSearchRadius: () => void
}

const UrgentStopFilters = ({
  filters,
  maxDistanceLimit,
  maxPriceLimit,
  onFiltersChange,
  onExpandSearchRadius,
}: UrgentStopFiltersProps) => {
  return (
    <section className="rounded-[1.5rem] border border-border/70 bg-card/85 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Urgent filters
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Keep this fast: distance, price, and parking trust first.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill variant="secondary">Tonight only</Pill>
            {filters.verifiedParkingOnly ? (
              <Pill className="bg-amber-500/15 text-amber-300">
                Verified parking
              </Pill>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-end">
          <label className="space-y-3 rounded-2xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">Max distance</span>
              <span className="text-sm text-primary">
                {filters.maxDistance} km
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={maxDistanceLimit}
              step={5}
              value={filters.maxDistance}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  maxDistance: Number(event.target.value),
                })
              }
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[var(--primary)]"
              aria-label="Maximum urgent distance"
            />
          </label>

          <label className="space-y-3 rounded-2xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">Max price</span>
              <span className="text-sm text-primary">
                {formatCurrency(filters.maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={maxPriceLimit}
              step={10}
              value={filters.maxPrice}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  maxPrice: Number(event.target.value),
                })
              }
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[var(--primary)]"
              aria-label="Maximum urgent price"
            />
          </label>

          <Button
            variant={filters.verifiedParkingOnly ? 'default' : 'outline'}
            className="justify-start rounded-2xl px-4 py-6"
            onClick={() =>
              onFiltersChange({
                ...filters,
                verifiedParkingOnly: !filters.verifiedParkingOnly,
              })
            }
          >
            <ShieldCheck className="size-4" />
            Verified parking only
          </Button>

          <Button
            variant={filters.coveredParkingOnly ? 'default' : 'outline'}
            className="justify-start rounded-2xl px-4 py-6"
            onClick={() =>
              onFiltersChange({
                ...filters,
                coveredParkingOnly: !filters.coveredParkingOnly,
              })
            }
          >
            Covered parking only
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/50 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            No safe stop nearby? Expand the search radius before dropping the
            verified parking requirement.
          </p>
          <Button variant="secondary" size="sm" onClick={onExpandSearchRadius}>
            Expand search radius
          </Button>
        </div>
      </div>
    </section>
  )
}

export default UrgentStopFilters
