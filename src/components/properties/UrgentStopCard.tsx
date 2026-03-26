import {
  ArrowUpRight,
  CircleParking,
  MapPinned,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import Pill from '@/components/ui/pill'
import Tag from '@/components/ui/tag'
import { buttonVariants } from '@/components/ui/button-variants'
import { formatCurrency } from '@/lib/helper'
import { cn } from '@/lib/utils'
import type { Property } from '@/types'

type UrgentStopCardProps = {
  property: Property
  distanceInKm: number
}

const UrgentStopCard = ({ property, distanceInKm }: UrgentStopCardProps) => {
  const navigateHref = `https://www.google.com/maps/dir/?api=1&destination=${property.coordinates.lat},${property.coordinates.lng}`

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/90 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.5)] backdrop-blur">
      <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
        <div className="relative min-h-64">
          <img
            src={property.image}
            alt={property.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-4 top-4 flex flex-wrap gap-2">
            {property.safeParkingVerified ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-lg">
                <ShieldCheck className="size-4" />
                Safe parking verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-background/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-foreground backdrop-blur">
                Parking not yet verified
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Pill>{distanceInKm.toFixed(1)} km away</Pill>
                <Pill
                  className={
                    property.availableTonight
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-muted text-muted-foreground'
                  }
                >
                  {property.availableTonight ? 'Available tonight' : 'Not tonight'}
                </Pill>
                {property.coveredParking ? (
                  <Pill className="bg-sky-500/15 text-sky-300">
                    Covered parking
                  </Pill>
                ) : null}
              </div>

              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {property.title}
                </h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPinned className="size-4" />
                  {property.location}
                </p>
              </div>

              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                {property.description}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-amber-500/30 bg-amber-500/10 p-4 xl:min-w-52">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                Rider trust
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {property.riderConfirmedCount}
              </p>
              <p className="mt-1 text-sm text-amber-100/85">
                riders confirmed this stop works well for overnight parking
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {property.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          <div className="grid gap-3 rounded-[1.5rem] border border-border/70 bg-background/50 p-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CircleParking className="size-4 text-primary" />
                {property.coveredParking ? 'Covered option' : 'Open but usable'}
              </span>
              <span>Price {formatCurrency(property.price)} / night</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to={`/properties/${property.id}`}
                className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
              >
                View details
              </Link>
              <a
                href={navigateHref}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
              >
                <ArrowUpRight className="size-4" />
                Navigate
              </a>
              <a
                href={`tel:${property.phone}`}
                className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}
              >
                <Phone className="size-4" />
                Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default UrgentStopCard
