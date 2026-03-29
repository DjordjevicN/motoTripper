import type { ReactNode } from 'react'

type HostFormSectionProps = {
  title: string
  description: string
  children: ReactNode
}

const HostFormSection = ({
  title,
  description,
  children,
}: HostFormSectionProps) => {
  return (
    <section className="rounded-[1.75rem] border border-border/70 bg-card/80 p-5">
      <div className="max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export default HostFormSection
