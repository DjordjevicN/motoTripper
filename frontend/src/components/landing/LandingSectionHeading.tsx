import type { ReactNode } from 'react'

import Pill from '@/components/ui/pill'

type LandingSectionHeadingProps = {
  eyebrow: string
  title: string
  description: string
  align?: 'left' | 'center'
  children?: ReactNode
}

const LandingSectionHeading = ({
  eyebrow,
  title,
  description,
  align = 'left',
  children,
}: LandingSectionHeadingProps) => {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <Pill>{eyebrow}</Pill>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
        {description}
      </p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  )
}

export default LandingSectionHeading
