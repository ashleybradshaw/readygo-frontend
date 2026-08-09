import { motion } from 'framer-motion'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  /** Keep the lime track in both positions (e.g. Run/Cycle selector). */
  alwaysOn?: boolean
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  alwaysOn = false,
}: ToggleSwitchProps) {
  const trackOn = alwaysOn || checked

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[31px] w-[51px] shrink-0 rounded-full p-[2px] transition-colors ${
        trackOn ? 'bg-[#70FF00]' : 'bg-[#263336]'
      }`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 520, damping: 34 }}
        className={`block size-[27px] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.25)] ${
          checked ? 'ml-auto' : ''
        } ${trackOn ? 'bg-white' : 'bg-[#829695]'}`}
      />
    </button>
  )
}
