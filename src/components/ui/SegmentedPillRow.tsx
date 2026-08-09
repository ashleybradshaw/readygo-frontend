type SegmentedPillOption = {
  id: string
  label: string
}

type SegmentedPillRowProps = {
  options: SegmentedPillOption[]
  value: string
  ariaLabel: string
  onChange: (id: string) => void
}

export const SegmentedPillRow = ({
  options,
  value,
  ariaLabel,
  onChange,
}: SegmentedPillRowProps) => (
  <div
    role="group"
    aria-label={ariaLabel}
    className="mt-3 flex flex-wrap gap-2"
  >
    {options.map((option) => {
      const active = value === option.id
      return (
        <button
          key={option.id}
          type="button"
          tabIndex={0}
          aria-pressed={active}
          aria-label={option.label}
          onClick={() => onChange(option.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onChange(option.id)
            }
          }}
          className={`inline-flex h-8 min-w-0 flex-1 items-center justify-center rounded-full border px-2.5 text-xs font-bold tracking-[-0.01em] transition-colors ${
            active
              ? 'border-[#70FF00] bg-[#70FF00]/10 text-[#70FF00]'
              : 'border-transparent bg-[#BACBC9]/10 text-[#BACBC9]'
          }`}
        >
          {option.label}
        </button>
      )
    })}
  </div>
)
