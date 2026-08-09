import closePill from '../../assets/ui/close-pill.png'

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
      className={`inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[8px] ${className}`}
    >
      <img
        src={closePill}
        alt=""
        aria-hidden="true"
        className="size-full object-cover"
      />
    </button>
  )
}
