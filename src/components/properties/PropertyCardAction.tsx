import { Button } from '@/components/ui/button'
import type { Property } from '@/types'
import { formatCurrency } from '@/lib/helper'

type PropertyCardActionProps = {
  property: Property
  actionLabel?: string
  onAction?: (property: Property) => void
}

const PropertyCardAction = ({
  property,
  actionLabel = 'Reserve',
  onAction,
}: PropertyCardActionProps) => {
  return (
    <div className="flex min-w-44 flex-col items-start gap-3 rounded-2xl bg-background/70 p-4 lg:items-end">
      <div className="space-y-1 lg:text-right">
        <p className="text-sm text-muted-foreground">Nightly price</p>
        <p className="text-3xl font-semibold tracking-tight">
          {formatCurrency(property.nightlyPrice)}
        </p>
      </div>
      <Button onClick={() => onAction?.(property)}>{actionLabel}</Button>
    </div>
  )
}

export default PropertyCardAction
