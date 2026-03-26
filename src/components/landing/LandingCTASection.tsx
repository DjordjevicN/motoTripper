import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

const LandingCTASection = () => {
  return (
    <section className="rounded-[2rem] border border-border/70 bg-gradient-to-r from-primary/14 via-card/95 to-card/95 p-8 text-center shadow-[0_26px_80px_-50px_rgba(15,23,42,0.45)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
        Final call
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        Ride safe. Stop smart.
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
        Built for riders who care where they leave the bike, especially when the
        day has already become harder than planned.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/urgent-stop"
          className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}
        >
          Find a safe stop tonight
        </Link>
        <Link
          to="/"
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
        >
          Explore the app
        </Link>
      </div>
    </section>
  )
}

export default LandingCTASection
