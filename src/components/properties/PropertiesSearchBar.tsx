import { BedDouble, MapPin, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { PropertySearch } from '@/types'

type PropertiesSearchBarProps = {
  search: PropertySearch
  onSearchChange: (search: PropertySearch) => void
}

const PropertiesSearchBar = ({
  search,
  onSearchChange,
}: PropertiesSearchBarProps) => {
  return (
    <section className="rounded-[1.75rem] border border-border/70 bg-background/80 p-5">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_auto] lg:items-end">
        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MapPin className="size-4 text-primary" />
            Town
          </span>
          <input
            type="text"
            value={search.town}
            onChange={(event) =>
              onSearchChange({
                ...search,
                town: event.target.value,
              })
            }
            placeholder="Search town or area"
            className="h-11 w-full rounded-xl border border-border/70 bg-card px-4 text-sm outline-none transition-colors focus:border-primary"
          />
        </label>

        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="size-4 text-primary" />
            Guests
          </span>
          <input
            type="number"
            min={1}
            value={search.guests}
            onChange={(event) =>
              onSearchChange({
                ...search,
                guests: Number(event.target.value) || 1,
              })
            }
            className="h-11 w-full rounded-xl border border-border/70 bg-card px-4 text-sm outline-none transition-colors focus:border-primary"
          />
        </label>

        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <BedDouble className="size-4 text-primary" />
            Rooms
          </span>
          <input
            type="number"
            min={1}
            value={search.rooms}
            onChange={(event) =>
              onSearchChange({
                ...search,
                rooms: Number(event.target.value) || 1,
              })
            }
            className="h-11 w-full rounded-xl border border-border/70 bg-card px-4 text-sm outline-none transition-colors focus:border-primary"
          />
        </label>

        <Button
          variant="outline"
          onClick={() =>
            onSearchChange({
              town: '',
              guests: 1,
              rooms: 1,
            })
          }
        >
          Reset search
        </Button>
      </div>
    </section>
  )
}

export default PropertiesSearchBar
