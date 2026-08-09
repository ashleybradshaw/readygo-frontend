import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

interface SettingsRowProps {
  label: string
  onClick?: () => void
  icon?: ReactNode
  tone?: 'default' | 'data' | 'danger'
  index?: number
  totalLength?: number
}

const resolveRadius = (index: number, totalLength: number) => {
  if (totalLength <= 1) return 'rounded-[4px]'
  if (index === 0) return 'rounded-t-[4px] rounded-b-none'
  if (index === totalLength - 1) return 'rounded-b-[4px] rounded-t-none'
  return 'rounded-none'
}

export const SettingsRow = ({
  label,
  onClick,
  tone = 'default',
  index = 0,
  totalLength = 1,
}: SettingsRowProps) => {
  const radius = resolveRadius(index, totalLength)
  const showTopBorder = index > 0

  const tones = {
    default: {
      text: 'text-[#BACBC9]',
      chevron: 'text-[#BACBC9]/50',
    },
    data: {
      text: 'text-[#C5A059]',
      chevron: 'text-[#C5A059]',
    },
    danger: {
      text: 'text-[#FF3B30]',
      chevron: 'text-[#FF3B30]',
    },
  }

  const palette = tones[tone]

  return (
    <button
      type="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick?.()
        }
      }}
      aria-label={label}
      className={`flex h-11 w-full items-center gap-3 bg-[#182629] px-4 text-left ${radius} ${
        showTopBorder ? 'border-t border-[#2D3739]/50' : ''
      }`}
    >
      <span
        className={`min-w-0 flex-1 font-sans text-sm font-bold tracking-[-0.01em] ${palette.text}`}
      >
        {label}
      </span>
      <ChevronRight
        className={`h-5 w-5 shrink-0 ${palette.chevron}`}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </button>
  )
}
