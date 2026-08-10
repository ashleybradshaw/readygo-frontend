interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  /** Keep the lime track tint in both positions (e.g. Run/Cycle selector). */
  alwaysOn?: boolean
}

export const ToggleSwitch = ({
  checked,
  onChange,
  label,
  alwaysOn = false,
}: ToggleSwitchProps) => {
  const trackOn = alwaysOn || checked

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onChange(!checked)
        }
      }}
      className={`flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border border-[#2D3739] p-1 transition-colors duration-200 ${
        trackOn ? 'bg-[#70FF00]/20' : 'bg-[#182629]'
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-4 w-5 rounded-full transition-transform duration-200 ease-in-out ${
          checked
            ? 'translate-x-5 bg-[#70FF00]'
            : 'translate-x-0 bg-[#BACBC9]/40'
        }`}
      />
    </button>
  )
}
