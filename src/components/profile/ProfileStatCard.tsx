type ProfileStatCardProps = {
  label: string
  value: string | number
  supportingText?: string
}

const ProfileStatCard = ({
  label,
  value,
  supportingText,
}: ProfileStatCardProps) => {
  return (
    <article className="rounded-[1.5rem] border border-border/70 bg-background/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      {supportingText ? (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {supportingText}
        </p>
      ) : null}
    </article>
  )
}

export default ProfileStatCard
