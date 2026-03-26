import type { Property } from '@/types'
import { formatCurrency } from '@/lib/helper'

type PropertyCardActionProps = {
  property: Property
}

const PropertyCardAction = ({ property }: PropertyCardActionProps) => {
  const totalNightlyCost =
    property.nightlyPrice + property.cleaningFee + property.serviceFee

  return (
    <div className="flex min-w-48 flex-col items-start gap-4 rounded-2xl bg-background/70 p-4 lg:items-end">
      <div className="space-y-1 lg:text-right">
        <p className="text-sm text-muted-foreground">Nightly price</p>
        <p className="text-3xl font-semibold tracking-tight">
          {formatCurrency(property.nightlyPrice)}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatCurrency(totalNightlyCost)} total with fees
        </p>
      </div>
      <div className="flex flex-col items-start gap-1.5 lg:items-end">
        <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-500/30">
          No prepayment needed
        </span>
        <span className="rounded-full bg-sky-500/15 px-2.5 py-1 text-[11px] font-medium text-sky-300 ring-1 ring-sky-500/30">
          Free cancellation
        </span>
        {property.trustSignals.onsiteVerifiedParking ? (
          <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-medium text-amber-300 ring-1 ring-amber-500/30">
            Safe parking verified
          </span>
        ) : null}
        {property.trustSignals.verifiedRiderRecommended ? (
          <span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-[11px] font-medium text-violet-300 ring-1 ring-violet-500/30">
            Verified users recommend
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default PropertyCardAction
