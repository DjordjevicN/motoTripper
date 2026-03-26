import { ArrowRight, Route, SearchCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

const featureCards = [
  {
    title: 'Routing is ready',
    description:
      'React Router is set up with a root layout and an index page so new screens can drop in without rewiring the app shell.',
    icon: Route,
  },
  {
    title: 'React Query is mounted',
    description:
      'QueryClientProvider and devtools are already connected in the entrypoint, which gives us a clean place to start data work.',
    icon: SearchCheck,
  },
]

export function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/85 px-6 py-10 shadow-[0_24px_80px_-32px_rgba(123,63,0,0.35)] backdrop-blur sm:px-10 sm:py-14">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              MotoTripper starter
            </span>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Vite, TypeScript, Tailwind, React Query, and shadcn are now lined
                up for the app.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                The starter screen has been replaced with a clean shell so we can
                move straight into product work instead of setup cleanup.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/app"
                className={cn(buttonVariants(), 'inline-flex')}
              >
                Open app route
                <ArrowRight />
              </Link>
              <a
                href="https://ui.shadcn.com/docs"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'inline-flex',
                )}
              >
                shadcn docs
              </a>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4 shadow-sm">
            <div className="rounded-[1.25rem] bg-gradient-to-br from-primary/15 via-transparent to-accent/30 p-5">
              <div className="grid gap-3 text-sm">
                <div className="rounded-xl border border-border/70 bg-card px-4 py-3">
                  <p className="font-medium">Packages installed</p>
                  <p className="mt-1 text-muted-foreground">
                    `react-router-dom`, `@tanstack/react-query`, `tailwindcss`,
                    and shadcn support utilities.
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-card px-4 py-3">
                  <p className="font-medium">Alias configured</p>
                  <p className="mt-1 text-muted-foreground">
                    Import app code through `@/` instead of deep relative paths.
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-card px-4 py-3">
                  <p className="font-medium">Ready for UI primitives</p>
                  <p className="mt-1 text-muted-foreground">
                    A reusable shadcn-style `Button` is included as the first
                    component.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 py-8 md:grid-cols-2">
        {featureCards.map(({ title, description, icon: Icon }) => (
          <article
            key={title}
            className="rounded-[1.5rem] border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur"
          >
            <div className="mb-4 inline-flex rounded-xl bg-secondary p-3 text-secondary-foreground">
              <Icon className="size-5" />
            </div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </article>
        ))}
      </section>
    </main>
  )
}
