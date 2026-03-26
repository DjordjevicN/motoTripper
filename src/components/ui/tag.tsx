import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type TagProps = {
  children: ReactNode
  className?: string
}

const Tag = ({ children, className }: TagProps) => {
  return (
    <span
      className={cn(
        'rounded-full border border-border/80 bg-background/80 px-3 py-1 text-sm text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Tag
