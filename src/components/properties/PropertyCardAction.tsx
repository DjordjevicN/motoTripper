import {
  getParkingBadgeVariant,
  getParkingVerificationLabel,
} from '@/lib/parkingTrust'
import { formatCurrency } from '@/lib/helper'
import type { Property, PropertyParkingTrust } from '@/types'

type PropertyCardActionProps = {
  property: Property
  parkingTrust: PropertyParkingTrust
}

const PropertyCardAction = ({
  property,
  parkingTrust,
}: PropertyCardActionProps) => {
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
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${getParkingBadgeVariant(
            parkingTrust.verificationLevel,
          )}`}
        >
          {getParkingVerificationLabel(parkingTrust.verificationLevel)}
        </span>
        <span className="text-[11px] text-muted-foreground">
          Confirmed by {parkingTrust.totalConfirmations} rider
          {parkingTrust.totalConfirmations === 1 ? '' : 's'}
          {parkingTrust.highTrustConfirmations > 0
            ? ` · ${parkingTrust.highTrustConfirmations} high-trust`
            : ''}
          {parkingTrust.photoEvidenceCount > 0
            ? ` · ${parkingTrust.photoEvidenceCount} photo verified`
            : ''}
        </span>
      </div>
    </div>
  )
}

export default PropertyCardAction
