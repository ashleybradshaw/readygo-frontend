type MultiSelectPillOption = {
  id: string
  label: string
}

type MultiSelectPillRowProps = {
  options: MultiSelectPillOption[]
  values: string[]
  ariaLabel: string
  onChange: (next: string[]) => void
}

export const MultiSelectPillRow = ({
  options,
  values,
  ariaLabel,
  onChange,
}: MultiSelectPillRowProps) => {
  const handleToggle = (id: string) => {
    if (values.includes(id)) {
      onChange(values.filter((value) => value !== id))
      return
    }
    onChange([...values, id])
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="mt-2 flex w-full flex-wrap items-center justify-start gap-[10px]"
    >
      {options.map((option) => {
        const active = values.includes(option.id)
        return (
          <button
            key={option.id}
            type="button"
            tabIndex={0}
            aria-pressed={active}
            aria-label={option.label}
            onClick={() => handleToggle(option.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleToggle(option.id)
              }
            }}
            className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-4 py-1.5 text-xs transition-colors ${
              active
                ? 'border-[#70FF00] bg-[#70FF00]/10 font-bold text-[#70FF00]'
                : 'border-[#2D3739] bg-[#0F191B]/60 font-medium text-[#BACBC9]'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
