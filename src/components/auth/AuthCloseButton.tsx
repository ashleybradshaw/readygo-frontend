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
    className="absolute right-6 top-7 z-10 inline-flex items-center justify-center rounded-full bg-[#182629] p-1.5 text-[#BACBC9]"
  >
    <X className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
  </button>
)
