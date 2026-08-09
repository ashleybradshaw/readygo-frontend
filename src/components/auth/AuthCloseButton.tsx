import { X } from 'lucide-react'

interface AuthCloseButtonProps {
  onClick: () => void
  ariaLabel?: string
}

export const AuthCloseButton = ({
  onClick,
  ariaLabel = 'Close',
}: AuthCloseButtonProps) => (
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
    className="absolute right-6 top-7 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#182629] text-[#BACBC9]"
  >
    <X size={16} strokeWidth={2.25} aria-hidden="true" />
  </button>
)
