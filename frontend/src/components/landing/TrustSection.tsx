import { Camera, CheckCircle2, ShieldCheck, Users } from 'lucide-react'

import LandingSectionHeading from '@/components/landing/LandingSectionHeading'
import Tag from '@/components/ui/tag'

const trustPoints = [
  {
    icon: ShieldCheck,
    title: 'Safe parking is earned',
    description:
      'Verified Safe Parking comes from rider confirmations, trusted contributors, and proof.',
  },
  {
    icon: Users,
    title: 'Not every review has equal weight',
    description:
      'Trusted, high-trust, and elite riders influence parking confidence more than brand-new accounts.',
  },
  {
    icon: Camera,
    title: 'Photo evidence matters',
    description:
      'Parking photos strengthen credibility and are required for the strongest verification level.',
  },
  {
    icon: CheckCircle2,
    title: 'Conflicting feedback stays visible',
    description:
      'If riders disagree on safety, the system avoids awarding the strongest badge and surfaces mixed feedback instead.',
  },
]

const TrustSection = () => {
  return (
    <section className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr] xl:items-center">
      <LandingSectionHeading
        eyebrow="Trust system"
        title="The parking badge is not bought. It is earned."
        description="That is the core product promise. Riders should be able to act fast because the strongest badge represents real parking evidence from trustworthy people."
      />

      <div className="rounded-[2rem] border border-border/70 bg-card/85 p-6 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)]">
        <div className="rounded-[1.75rem] border border-amber-500/30 bg-amber-500/10 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="border-amber-500/35 bg-amber-500/15 text-amber-300">
              Verified Safe Parking
            </Tag>
            <Tag className="border-sky-500/35 bg-sky-500/10 text-sky-300">
              Photo Verified Parking
            </Tag>
          </div>
          <p className="mt-4 text-sm leading-7 text-amber-100/90">
            Example rule: three safe parking confirmations, two from high-trust
            or elite riders, at least one photo, and no serious contradiction
            pattern.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {trustPoints.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-[1.5rem] border border-border/70 bg-background/60 p-4"
            >
              <div className="inline-flex rounded-full bg-primary/10 p-2.5 text-primary">
                <Icon className="size-4" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustSection
