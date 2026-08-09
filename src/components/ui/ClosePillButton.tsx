import { X } from 'lucide-react'

interface ClosePillButtonProps {
  onClick: () => void
  className?: string
  ariaLabel?: string
}

export const ClosePillButton = ({
  onClick,
  className = '',
  ariaLabel = 'Close',
}: ClosePillButtonProps) => {
  return (
    <button
      type="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#182629] p-1.5 text-[#BACBC9] ${className}`}
    >
      <X className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
    </button>
  )
}
