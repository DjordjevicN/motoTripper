import { ArrowRight, MapPinned, ShieldCheck, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

import Pill from '@/components/ui/pill'
import Tag from '@/components/ui/tag'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

type LandingHeroProps = {
  scrollY: number
  reducedMotion: boolean
}

const LandingHero = ({ scrollY, reducedMotion }: LandingHeroProps) => {
  const slowParallax = reducedMotion
    ? undefined
    : { transform: `translateY(${scrollY * 0.12}px)` }
  const mediumParallax = reducedMotion
    ? undefined
    : { transform: `translateY(${scrollY * 0.18}px)` }

  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border border-border/70 bg-card/90 px-6 py-8 shadow-[0_40px_120px_-50px_rgba(15,23,42,0.55)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-x-[-5%] top-[-10%] h-[60%] rounded-full bg-[radial-gradient(circle,_rgba(245,158,11,0.18),_transparent_55%)] blur-3xl"
          style={slowParallax}
        />
        <div
          className="absolute right-[-8%] top-[18%] h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.14),_transparent_60%)] blur-3xl"
          style={mediumParallax}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.52))]"
          style={slowParallax}
        />
        <div
          className="absolute inset-x-[8%] bottom-8 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent"
          style={mediumParallax}
        />
      </div>

      <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Tag className="border-amber-500/30 bg-amber-500/10 text-amber-300">
              Built for riders under pressure
            </Tag>
            <Tag className="border-sky-500/30 bg-sky-500/10 text-sky-300">
              Safe parking earned through trust
            </Tag>
          </div>

          <div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl xl:text-6xl">
              Find a safe place to stop fast when the ride stops feeling safe.
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              MotoTripper helps motorcycle riders quickly find stays with real
              rider-confirmed parking trust, covered parking signals, and urgent
              stop confidence when rain, fatigue, cold, or darkness hits.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/urgent-stop"
              className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}
            >
              <TriangleAlert className="size-4" />
              Need a safe stop now?
            </Link>
            <Link
              to="/"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              Explore rider-friendly stays
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            <Pill variant="secondary">Dark by default</Pill>
            <Pill variant="secondary">Trust-first parking badges</Pill>
            <Pill variant="secondary">Urgent-stop mode built in</Pill>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] border border-border/70 bg-background/60 p-5 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Tonight near Belgrade
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  Calm under pressure
                </h3>
              </div>
              <MapPinned className="size-6 text-primary" />
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-[1.5rem] border border-amber-500/25 bg-amber-500/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Verified Safe Parking</p>
                    <p className="mt-1 text-sm text-amber-100/85">
                      3 riders confirmed it, 2 high-trust, photo evidence attached
                    </p>
                  </div>
                  <ShieldCheck className="size-5 text-amber-300" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                  <p className="text-sm text-muted-foreground">Urgent stop time</p>
                  <p className="mt-2 text-2xl font-semibold">Under 60s</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                  <p className="text-sm text-muted-foreground">Parking confidence</p>
                  <p className="mt-2 text-2xl font-semibold">95 / 100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingHero
