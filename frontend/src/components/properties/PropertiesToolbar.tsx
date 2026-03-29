import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Pill from '@/components/ui/pill'
import { formatCurrency } from '@/lib/helper'

type SortMode = 'distance' | 'price-asc' | 'price-desc'

type PropertiesToolbarProps = {
  visibleCount: number
  locationLabel: string
  maxPrice: number
  maxDistance: number
  sortMode: SortMode
  onSortChange: (sortMode: SortMode) => void
}

const PropertiesToolbar = ({
  visibleCount,
  locationLabel,
  maxPrice,
  maxDistance,
  sortMode,
  onSortChange,
}: PropertiesToolbarProps) => {
  return (
    <div className="rounded-[1.5rem] border border-border/70 bg-background/70 px-4 py-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Nearby properties
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              {visibleCount} stays
            </h2>
            <span className="text-sm text-muted-foreground">
              around {locationLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <Pill variant="secondary" className="text-[11px]">
              Max price: {formatCurrency(maxPrice)}
            </Pill>
            <Pill variant="secondary" className="text-[11px]">
              Max distance: {maxDistance} km
            </Pill>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={sortMode === 'distance' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange('distance')}
            >
              Distance
            </Button>
            <Button
              variant={sortMode === 'price-asc' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange('price-asc')}
            >
              <ArrowUpNarrowWide />
              Price
            </Button>
            <Button
              variant={sortMode === 'price-desc' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange('price-desc')}
            >
              <ArrowDownNarrowWide />
              Price
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertiesToolbar
