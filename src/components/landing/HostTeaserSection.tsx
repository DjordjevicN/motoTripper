import { Link } from 'react-router-dom'

import LandingSectionHeading from '@/components/landing/LandingSectionHeading'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

const HostTeaserSection = () => {
  return (
    <section className="rounded-[2rem] border border-border/70 bg-card/85 p-6 shadow-[0_22px_60px_-45px_rgba(15,23,42,0.4)] sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
        <LandingSectionHeading
          eyebrow="For hosts later"
          title="Own a stay with genuinely secure motorcycle parking?"
          description="Eventually, rider-friendly hosts will be able to stand out by earning trust through real confirmations, not by buying a better badge."
        />

        <div className="rounded-[1.75rem] border border-amber-500/25 bg-amber-500/10 p-5">
          <p className="text-sm leading-7 text-amber-100/90">
            The right hosts are the ones who understand why secure parking,
            flexible arrival, and practical rider amenities create loyalty with
            the people actually using the road.
          </p>
          <div className="mt-5">
            <Link
              to="/signup"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              Join as a founding host
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HostTeaserSection
