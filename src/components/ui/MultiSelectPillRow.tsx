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
      className="flex w-full flex-wrap items-center justify-center gap-[10px]"
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
            className={`inline-flex h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-2.5 text-xs tracking-[-0.01em] transition-colors ${
              active
                ? 'border-[#70FF00] bg-[#70FF00]/10 font-medium text-white'
                : 'border-transparent bg-[#BACBC9]/10 font-bold text-[#BACBC9]'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
