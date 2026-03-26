import { useState } from 'react'
import { Filter, SlidersHorizontal, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

import { mockCurrentUserId } from '@/data/users/mockUsers'
import { formatCurrency } from '@/lib/helper'
import type { PropertyFilters } from '@/types'
import FilterSliderCard from './FilterSliderCard'
import HomeFiltersModal from './HomeFiltersModal'

type HomeFiltersProps = {
  maxDistance: number
  maxPrice: number
  maxDistanceLimit: number
  minPriceLimit: number
  maxPriceLimit: number
  distanceStep: number
  priceStep: number
  locationLabel: string
  advancedFilters: PropertyFilters
  onMaxDistanceChange: (value: number) => void
  onMaxPriceChange: (value: number) => void
  onAdvancedFiltersChange: (filters: PropertyFilters) => void
  onResetDistance: () => void
  onResetPrice: () => void
  onResetAdvancedFilters: () => void
}

const HomeFilters = ({
  maxDistance,
  maxPrice,
  maxDistanceLimit,
  minPriceLimit,
  maxPriceLimit,
  distanceStep,
  priceStep,
  locationLabel,
  advancedFilters,
  onMaxDistanceChange,
  onMaxPriceChange,
  onAdvancedFiltersChange,
  onResetDistance,
  onResetPrice,
  onResetAdvancedFilters,
}: HomeFiltersProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <HomeFiltersModal
        isOpen={isModalOpen}
        filters={advancedFilters}
        onClose={() => setIsModalOpen(false)}
        onFiltersChange={onAdvancedFiltersChange}
        onReset={onResetAdvancedFilters}
      />

      <div className="space-y-5 rounded-[1.75rem] border border-border/70 bg-background/90 p-5 lg:h-full lg:overflow-y-auto lg:pr-3">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              aria-label="Open advanced filters"
              className="inline-flex rounded-full bg-primary/10 p-3 text-primary transition-opacity hover:opacity-85"
            >
              <SlidersHorizontal className="size-5" />
            </button>
            <Link
              to={`/profile/${mockCurrentUserId}`}
              aria-label="Open profile"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border/70 bg-card/80 text-primary shadow-sm transition-opacity hover:opacity-85"
            >
              <UserRound className="size-5" />
            </Link>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Filters
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Find the right stay nearby
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              We are currently sorting everything by distance from the user and
              applying a price filter on the side.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-primary" />
            <h2 className="text-lg font-semibold">Distance</h2>
          </div>

          <FilterSliderCard
            title="Max distance"
            valueLabel={`${maxDistance} km`}
            min={distanceStep}
            max={maxDistanceLimit}
            step={distanceStep}
            value={maxDistance}
            minLabel={`${distanceStep} km`}
            maxLabel={`${maxDistanceLimit} km`}
            description={`Showing properties within ${maxDistance} km of ${locationLabel}.`}
            ariaLabel="Maximum distance"
            onChange={onMaxDistanceChange}
            onReset={onResetDistance}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-primary" />
            <h2 className="text-lg font-semibold">Price</h2>
          </div>

          <FilterSliderCard
            title="Max nightly price"
            valueLabel={formatCurrency(maxPrice)}
            min={minPriceLimit}
            max={maxPriceLimit}
            step={priceStep}
            value={maxPrice}
            minLabel={formatCurrency(minPriceLimit)}
            maxLabel={formatCurrency(maxPriceLimit)}
            description={`Showing properties priced at ${formatCurrency(maxPrice)} per night or less.`}
            ariaLabel="Maximum nightly price"
            onChange={onMaxPriceChange}
            onReset={onResetPrice}
          />
        </div>
      </div>
    </>
  )
}

export default HomeFilters
