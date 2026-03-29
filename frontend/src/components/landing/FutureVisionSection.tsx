import { Compass, Route, Shield, Star } from 'lucide-react'

import LandingSectionHeading from '@/components/landing/LandingSectionHeading'

const futureItems = [
  {
    icon: Shield,
    title: 'Rider trust network',
    description:
      'Trust becomes a living graph of who contributes useful parking evidence and who the community relies on.',
  },
  {
    icon: Route,
    title: 'Route-aware stop suggestions',
    description:
      'Future recommendations can consider route timing, weather, and how close a trusted stop is to where the day should end.',
  },
  {
    icon: Star,
    title: 'Saved trips and rider memory',
    description:
      'The stays you trust, the hosts that work well, and the stops worth repeating can become part of your travel rhythm.',
  },
  {
    icon: Compass,
    title: 'Rider-first discovery',
    description:
      'Over time the product can support both urgent stops and better-planned tours without losing the parking-first DNA.',
  },
]

const FutureVisionSection = () => {
  return (
    <section className="space-y-8">
      <LandingSectionHeading
        eyebrow="Where this goes"
        title="The long-term vision is a rider trust network, not just a list of stays."
        description="The MVP starts with urgent stop confidence, but the product can grow into route-aware discovery and a community memory of which places actually work for motorcycles."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {futureItems.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5"
          >
            <div className="inline-flex rounded-full bg-primary/10 p-3 text-primary">
              <Icon className="size-5" />
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FutureVisionSection
