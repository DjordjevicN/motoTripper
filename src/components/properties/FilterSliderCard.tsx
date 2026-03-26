type FilterSliderCardProps = {
  title: string
  valueLabel: string
  min: number
  max: number
  step: number
  value: number
  minLabel: string
  maxLabel: string
  description: string
  ariaLabel: string
  onChange: (value: number) => void
  onReset: () => void
}

const FilterSliderCard = ({
  title,
  valueLabel,
  min,
  max,
  step,
  value,
  minLabel,
  maxLabel,
  description,
  ariaLabel,
  onChange,
  onReset,
}: FilterSliderCardProps) => {
  return (
    <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">
            {valueLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
        >
          Reset
        </button>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[var(--primary)]"
        aria-label={ariaLabel}
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>

      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  )
}

export default FilterSliderCard
