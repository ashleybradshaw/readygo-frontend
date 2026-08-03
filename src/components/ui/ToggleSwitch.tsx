import { motion } from 'framer-motion'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[17px] w-[53px] shrink-0 rounded-full p-[2px] transition-colors ${
        checked ? 'bg-rg-lime-alt/40' : 'bg-[#1C2A33]'
      }`}
    >
      <motion.span
        layout
        className={`block h-[13px] w-[33px] rounded-full ${
          checked ? 'ml-auto bg-[#7CFF00]' : 'bg-[#4F6163]'
        }`}
      />
    </button>
  )
}
