type HostStepCardProps = {
  step: string
  title: string
  description: string
}

const HostStepCard = ({ step, title, description }: HostStepCardProps) => {
  return (
    <article className="rounded-[1.5rem] border border-border/70 bg-background/55 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {step}
      </p>
      <h3 className="mt-3 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </article>
  )
}

export default HostStepCard
