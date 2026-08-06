import { X } from 'lucide-react'

type SettingsCloseButtonProps = {
  onClick: () => void
  variant?: 'onLight' | 'onDark'
  className?: string
}

export const SettingsCloseButton = ({
  onClick,
  variant = 'onLight',
  className = '',
}: SettingsCloseButtonProps) => {
  const isOnLight = variant === 'onLight'

  return (
    <button
      type="button"
      aria-label="Close"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      className={`inline-flex size-7 shrink-0 items-center justify-center rounded-[8px] ${
        isOnLight
          ? 'bg-[#0F1918] text-[#DCE4E2]'
          : 'bg-[#DCE4E2] text-[#0F1918]'
      } ${className}`}
    >
      <X size={28} strokeWidth={2.5} aria-hidden="true" />
    </button>
  )
}
