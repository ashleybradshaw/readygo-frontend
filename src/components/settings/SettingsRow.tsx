import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

interface SettingsRowProps {
  label: string
  onClick?: () => void
  icon?: ReactNode
  tone?: 'default' | 'data' | 'danger'
}

export const SettingsRow = ({
  label,
  onClick,
  tone = 'default',
}: SettingsRowProps) => {
  const tones = {
    default: {
      text: 'text-[#BACBC9]',
      chevron: 'text-[#BACBC9]/50',
    },
    data: {
      text: 'text-[#FBBC05]',
      chevron: 'text-[#FBBC05]',
    },
    danger: {
      text: 'text-[#FF3B3B]',
      chevron: 'text-[#FF3B3B]',
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
      className="mb-[5px] flex w-full cursor-pointer items-center justify-between rounded-[4px] border border-[#2D3739]/60 bg-[#182629]/60 p-4 text-left transition-colors hover:bg-[#182629]"
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
