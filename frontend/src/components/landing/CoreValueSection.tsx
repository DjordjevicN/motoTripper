import { Clock3, Compass, ShieldCheck, Warehouse } from 'lucide-react'

import LandingSectionHeading from '@/components/landing/LandingSectionHeading'

const values = [
  {
    icon: ShieldCheck,
    title: 'Verified Safe Parking',
    description:
      'The strongest parking badge is earned through rider evidence, not owner claims or paid placement.',
  },
  {
    icon: Compass,
    title: 'Trusted rider confirmations',
    description:
      'High-trust riders carry more weight, so quality evidence matters more than raw volume.',
  },
  {
    icon: Clock3,
    title: 'Fast urgent-stop decisions',
    description:
      'When conditions turn, the product helps you decide quickly instead of digging through generic booking clutter.',
  },
  {
    icon: Warehouse,
    title: 'Rider-focused stays',
    description:
      'Covered parking, trailer access, late arrival, drying space, and practical road-trip needs stay front and center.',
  },
]

const CoreValueSection = () => {
  return (
    <section className="space-y-8">
      <LandingSectionHeading
        eyebrow="Why it feels different"
        title="This is not a booking site with motorcycle filters added later."
        description="The product is built around the real questions riders ask first: Can I trust the parking, can I stop quickly, and will this place work for the way I travel?"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {values.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="rounded-[1.75rem] border border-border/70 bg-card/85 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="inline-flex rounded-full bg-primary/10 p-3 text-primary">
                <Icon className="size-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CoreValueSection
