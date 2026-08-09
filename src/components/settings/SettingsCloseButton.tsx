import { ClosePillButton } from '../ui/ClosePillButton'

type SettingsCloseButtonProps = {
  onClick: () => void
  variant?: 'onLight' | 'onDark'
  className?: string
}

/** @deprecated Prefer ClosePillButton — kept for call-site compatibility. */
export const SettingsCloseButton = ({
  onClick,
  className = '',
}: SettingsCloseButtonProps) => (
  <ClosePillButton onClick={onClick} className={className} />
)
