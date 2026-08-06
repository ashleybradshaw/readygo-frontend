import {
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  UserRound,
  X,
  type LucideProps,
} from 'lucide-react'
import { SuccessBadgeIcon } from '../overlays/OverlayBadges'

export const AUTH_ICON = {
  size: 24,
  strokeWidth: 1.75,
  color: '#4F6163',
  activeColor: '#BACBC9',
  successColor: '#84BCA4',
} as const

type AuthIconProps = Omit<LucideProps, 'size' | 'strokeWidth' | 'color'> & {
  active?: boolean
  size?: number
  strokeWidth?: number
  color?: string
  className?: string
}

const resolveColor = ({
  active,
  color,
}: {
  active?: boolean
  color?: string
}) => {
  if (color) return color
  if (active) return AUTH_ICON.activeColor
  return 'currentColor'
}

const FieldIcon = ({
  Icon,
  active,
  color,
  size = AUTH_ICON.size,
  strokeWidth = AUTH_ICON.strokeWidth,
  className = '',
  ...props
}: AuthIconProps & {
  Icon: typeof Mail
}) => (
  <Icon
    size={size}
    strokeWidth={strokeWidth}
    color={resolveColor({ active, color })}
    className={`shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  />
)

export function EmailFieldIcon(props: AuthIconProps) {
  return <FieldIcon Icon={Mail} {...props} />
}

export function PasswordFieldIcon(props: AuthIconProps) {
  return <FieldIcon Icon={Lock} {...props} />
}

export function KeyFieldIcon(props: AuthIconProps) {
  return <FieldIcon Icon={KeyRound} {...props} />
}

export function ProfileFieldIcon(props: AuthIconProps) {
  return <FieldIcon Icon={UserRound} {...props} />
}

export function LocationFieldIcon(props: AuthIconProps) {
  return <FieldIcon Icon={MapPin} {...props} />
}

export function CloseBoxedIcon({
  className = '',
  size = 34,
  strokeWidth = 3,
  shape = 'square',
  ...props
}: AuthIconProps & { shape?: 'square' | 'circle' }) {
  const isCircle = shape === 'circle'

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center bg-[#BACBC9] ${
        isCircle
          ? 'size-11 rounded-full'
          : 'size-[42px] rounded-[10px]'
      } ${className}`}
      aria-hidden="true"
    >
      <X
        size={isCircle ? AUTH_ICON.size : size}
        strokeWidth={isCircle ? AUTH_ICON.strokeWidth : strokeWidth}
        color="#0F1918"
        {...props}
      />
    </span>
  )
}

export function ReturnBoxedIcon(props: AuthIconProps) {
  return <CloseBoxedIcon shape="circle" {...props} />
}

export function SuccessCheckIcon({ className = '' }: { className?: string }) {
  return <SuccessBadgeIcon className={className} />
}

export function EyeToggleIcon({
  hidden = false,
  className = '',
  active,
  color,
  size = AUTH_ICON.size,
  strokeWidth = AUTH_ICON.strokeWidth,
  ...props
}: AuthIconProps & { hidden?: boolean }) {
  const Icon = hidden ? EyeOff : Eye
  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      color={resolveColor({ active, color })}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    />
  )
}
