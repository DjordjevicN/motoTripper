import LandingSectionHeading from '@/components/landing/LandingSectionHeading'

const steps = [
  'Use your location or a nearby fallback area',
  'See urgent stays ranked by parking trust and distance',
  'Check the strongest parking signal first',
  'Stop with confidence before the ride becomes a risk',
]

const UrgentStopFlowSection = () => {
  return (
    <section className="space-y-8">
      <LandingSectionHeading
        eyebrow="Urgent-stop flow"
        title="The MVP is built for the moment when you should stop riding."
        description="MotoTripper helps you move from uncertainty to action in a short, practical sequence."
        align="center"
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {steps.map((step, index) => (
          <article
            key={step}
            className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Step {index + 1}
            </p>
            <p className="mt-4 text-lg font-semibold tracking-tight">{step}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default UrgentStopFlowSection
