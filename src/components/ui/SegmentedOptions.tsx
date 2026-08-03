interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedOptionsProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T | T[]
  multiple?: boolean
  onChange: (value: T | T[]) => void
}

export function SegmentedOptions<T extends string>({
  options,
  value,
  multiple = false,
  onChange,
}: SegmentedOptionsProps<T>) {
  const selected = Array.isArray(value) ? value : [value]

  const toggle = (next: T) => {
    if (!multiple) {
      onChange(next)
      return
    }
    const exists = selected.includes(next)
    const updated = exists
      ? selected.filter((item) => item !== next)
      : [...selected, next]
    onChange(updated.length ? updated : selected)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              active
                ? 'bg-[#7CFF00] text-rg-text-on-accent'
                : 'bg-rg-surface text-rg-text-muted outline outline-1 outline-[#365466]'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
