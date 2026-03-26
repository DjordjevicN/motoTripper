import { CloudRainWind, MoonStar, ShieldAlert, ThermometerSnowflake } from 'lucide-react'

import LandingSectionHeading from '@/components/landing/LandingSectionHeading'

const scenarios = [
  {
    icon: CloudRainWind,
    title: 'Caught in rain',
    description:
      'You are wet, visibility is dropping, and you need somewhere that treats motorcycle parking like part of the stay.',
  },
  {
    icon: MoonStar,
    title: 'Daylight is fading',
    description:
      'You want to stop before darkness forces a bad decision, not after the road has already become the risk.',
  },
  {
    icon: ThermometerSnowflake,
    title: 'Cold and fatigue hit',
    description:
      'When reaction time drops, the best move is finding a secure stop fast, not pushing through another hour.',
  },
  {
    icon: ShieldAlert,
    title: 'The bike must be safe',
    description:
      'Parking is not a minor amenity. It is the difference between sleeping well and worrying all night.',
  },
]

const ProblemSection = () => {
  return (
    <section className="space-y-8">
      <LandingSectionHeading
        eyebrow="The rider problem"
        title="When the ride stops being fun, you need a safe stop fast."
        description="MotoTripper starts from the real moment where weather, fatigue, falling light, and motorcycle security all collide at once."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {scenarios.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.45)]"
          >
            <div className="inline-flex rounded-full bg-primary/10 p-3 text-primary">
              <Icon className="size-5" />
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ProblemSection
