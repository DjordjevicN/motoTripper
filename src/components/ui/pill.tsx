import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const pillVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
  {
    variants: {
      variant: {
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary text-secondary-foreground',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

type PillProps = React.ComponentProps<'span'> & VariantProps<typeof pillVariants>

const Pill = ({ className, variant, ...props }: PillProps) => {
  return (
    <span
      className={cn(pillVariants({ variant }), className)}
      {...props}
    />
  )
}

export default Pill
