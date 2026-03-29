import { AlertTriangle, CheckCircle2, Shield, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

const riderRules = [
  'Only post places you have actually stayed at or personally verified on arrival.',
  'Do not claim parking is safe unless you truly left a motorcycle there and felt comfortable doing so.',
  'If a listing is community-posted, make it clear when contact details came from a public website or direct conversation.',
  'Photos and parking confirmations should reflect the real setup, not guesses or owner promises.',
]

const hostRules = [
  'Hosts can describe their parking setup, but they cannot buy or self-award Verified Safe Parking.',
  'Official host listings must use real contact details, accurate parking information, and current availability practices.',
  'If parking changes, hosts are expected to update the listing quickly so riders are not misled.',
]

const trustRules = [
  'Verified Safe Parking is earned only through rider confirmations, trust-weighted evidence, and photo proof when available.',
  'Trusted and high-trust riders carry more weight than brand new accounts, but every useful review still matters.',
  'Conflicting parking feedback can remove or block strong trust badges until the evidence is clearer.',
]

const enforcementRules = [
  'Spam, fake reviews, copied photos, or misleading parking claims can lead to content removal or account restrictions.',
  'Repeated attempts to game trust signals may reduce the visibility of a rider, host, or listing.',
  'Community-posted listings stay clearly labeled until a property owner claims them through the official host flow.',
]

const RulesPage = () => {
  return (
    <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-none py-8">
      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)]">
        <div className="border-b border-border/70 bg-gradient-to-br from-primary/16 via-background to-background p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Platform rules
            </span>
            <span className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Trust-first
            </span>
            <span className="inline-flex items-center rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              Rider-first
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Rules that protect riders, honest hosts, and parking trust.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            This platform is built around one promise: riders should be able to
            stop with confidence. These rules keep community-posted places,
            host-posted listings, rider reviews, and parking verification clear
            and hard to fake.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/"
              className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}
            >
              Explore stays
            </Link>
            <Link
              to="/landing"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              Back to landing
            </Link>
          </div>
        </div>

        <div className="grid gap-6 p-8 sm:p-10 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <section className="rounded-[1.75rem] border border-border/70 bg-background/55 p-6">
              <div className="flex items-center gap-3">
                <Shield className="size-5 text-primary" />
                <h2 className="text-2xl font-semibold tracking-tight">
                  Core principles
                </h2>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <article className="rounded-[1.25rem] border border-border/70 bg-card/70 p-4">
                  <p className="text-sm font-semibold text-foreground">
                    Truth over volume
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Many weak signals should never outweigh clear, credible
                    evidence from riders who actually used the property.
                  </p>
                </article>
                <article className="rounded-[1.25rem] border border-border/70 bg-card/70 p-4">
                  <p className="text-sm font-semibold text-foreground">
                    Safety over marketing
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Trust badges are earned from rider experience, not purchased
                    as premium placement.
                  </p>
                </article>
                <article className="rounded-[1.25rem] border border-border/70 bg-card/70 p-4">
                  <p className="text-sm font-semibold text-foreground">
                    Clarity over confusion
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Community-posted listings and official host listings must be
                    visually distinct at all times.
                  </p>
                </article>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-border/70 bg-background/55 p-6">
              <div className="flex items-center gap-3">
                <Users className="size-5 text-amber-300" />
                <h2 className="text-2xl font-semibold tracking-tight">
                  Rules for riders
                </h2>
              </div>
              <ul className="mt-5 space-y-3">
                {riderRules.map((rule) => (
                  <li
                    key={rule}
                    className="flex gap-3 rounded-[1.25rem] border border-border/70 bg-card/70 p-4 text-sm leading-6 text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[1.75rem] border border-border/70 bg-background/55 p-6">
              <div className="flex items-center gap-3">
                <Shield className="size-5 text-sky-300" />
                <h2 className="text-2xl font-semibold tracking-tight">
                  Rules for hosts
                </h2>
              </div>
              <ul className="mt-5 space-y-3">
                {hostRules.map((rule) => (
                  <li
                    key={rule}
                    className="flex gap-3 rounded-[1.25rem] border border-border/70 bg-card/70 p-4 text-sm leading-6 text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sky-300" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[1.75rem] border border-border/70 bg-background/55 p-6">
              <div className="flex items-center gap-3">
                <Shield className="size-5 text-violet-300" />
                <h2 className="text-xl font-semibold tracking-tight">
                  Parking trust rules
                </h2>
              </div>
              <ul className="mt-5 space-y-3">
                {trustRules.map((rule) => (
                  <li
                    key={rule}
                    className="rounded-[1.25rem] border border-border/70 bg-card/70 p-4 text-sm leading-6 text-muted-foreground"
                  >
                    {rule}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[1.75rem] border border-border/70 bg-background/55 p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="size-5 text-amber-300" />
                <h2 className="text-xl font-semibold tracking-tight">
                  Enforcement and moderation
                </h2>
              </div>
              <ul className="mt-5 space-y-3">
                {enforcementRules.map((rule) => (
                  <li
                    key={rule}
                    className="rounded-[1.25rem] border border-amber-500/15 bg-amber-500/5 p-4 text-sm leading-6 text-muted-foreground"
                  >
                    {rule}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[1.75rem] border border-primary/20 bg-primary/8 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                What the labels mean
              </p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">
                    Official host listing:
                  </span>{' '}
                  the property owner or operator is actively listing the stay on
                  the platform.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Community posted:
                  </span>{' '}
                  added by a rider based on real experience or verifiable public
                  information, but not yet claimed by the owner.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Verified Safe Parking:
                  </span>{' '}
                  earned from rider evidence and trust-weighted confirmations,
                  never sold as a platform feature.
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}

export default RulesPage
