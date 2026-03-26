import { MapPin } from 'lucide-react'

type PropertyLocationProps = {
  locationLabel: string
}

const PropertyLocation = ({ locationLabel }: PropertyLocationProps) => {
  return (
    <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
      <MapPin className="size-4" />
      {locationLabel}
    </p>
  )
}

export default PropertyLocation
