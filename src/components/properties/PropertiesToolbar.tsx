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
    <div className="flex flex-col gap-3 rounded-[1.75rem] border border-border/70 bg-background/80 p-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Nearby properties
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Sort by distance or price
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Showing {visibleCount} stays around {locationLabel}.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Pill variant="secondary" className="text-[11px]">
          Max price: {formatCurrency(maxPrice)}
        </Pill>
        <Pill variant="secondary" className="text-[11px]">
          Max distance: {maxDistance} km
        </Pill>
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
  )
}

export default PropertiesToolbar
