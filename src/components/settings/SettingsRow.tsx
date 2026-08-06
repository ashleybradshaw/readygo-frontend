import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface SettingsRowProps {
  label: string
  onClick?: () => void
  icon?: ReactNode
  tone?: 'default' | 'data' | 'danger'
  index?: number
  totalLength?: number
}

const resolveRadius = (index: number, totalLength: number) => {
  if (totalLength <= 1) return 'rounded-[10px]'
  if (index === 0) return 'rounded-t-[10px] rounded-b-none'
  if (index === totalLength - 1) return 'rounded-b-[10px] rounded-t-none'
  return 'rounded-none'
}

export const SettingsRow = ({
  label,
  onClick,
  icon,
  tone = 'default',
  index = 0,
  totalLength = 1,
}: SettingsRowProps) => {
  const isLast = index === totalLength - 1
  const radius = resolveRadius(index, totalLength)

  const tones = {
    default: {
      row: 'bg-[#EBF1EF] text-[#0F1918]',
      chevron: '#0F191B',
      divider: 'border-[#D2DDD9]',
    },
    data: {
      row: 'bg-[#182629] text-[#BACBC9]',
      chevron: '#BACBC9',
      divider: 'border-[#D2DDD9]/25',
    },
    danger: {
      row: 'bg-[#2D191C] text-[#BC757D]',
      chevron: '#BC757D',
      divider: 'border-[#D2DDD9]/25',
    },
  }

  const palette = tones[tone]

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      aria-label={label}
      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${radius} ${palette.row} ${
        !isLast ? `border-b ${palette.divider}` : ''
      }`}
    >
      {icon ? (
        <span className="inline-flex size-6 shrink-0 items-center justify-center [&_svg]:text-current">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 font-sans text-base font-bold tracking-[-0.01em]">
        {label}
      </span>
      <span
        className="inline-flex size-8 shrink-0 items-center justify-center"
        aria-hidden="true"
      >
        <ChevronRight size={32} strokeWidth={1.5} color={palette.chevron} />
      </span>
    </motion.button>
  )
}
