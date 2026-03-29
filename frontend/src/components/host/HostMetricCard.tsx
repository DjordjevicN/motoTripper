type HostMetricCardProps = {
  label: string
  value: string | number
}

const HostMetricCard = ({ label, value }: HostMetricCardProps) => {
  return (
    <article className="rounded-[1.5rem] border border-border/70 bg-background/55 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
    </article>
  )
}

export default HostMetricCard
