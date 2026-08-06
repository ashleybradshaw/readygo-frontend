import type { ImgHTMLAttributes } from 'react'
import checkSquare from '../../assets/icons/Check-Square-.svg'
import errorSquare from '../../assets/icons/Error-square.svg'
import weatherIcon from '../../assets/icons/Weather Icon Container.svg'
import locationIcon from '../../assets/icons/Notification Message.svg'

type BadgeProps = {
  className?: string
  size?: number
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>

const OverlayBadge = ({
  src,
  size = 60,
  className = '',
  ...props
}: BadgeProps & { src: string }) => (
  <span
    className={`inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className="size-full object-contain"
      draggable={false}
      {...props}
    />
  </span>
)

export const SuccessBadgeIcon = ({ size = 60, ...props }: BadgeProps) => (
  <OverlayBadge src={checkSquare} size={size} {...props} />
)

export const ErrorBadgeIcon = ({ size = 60, ...props }: BadgeProps) => (
  <OverlayBadge src={errorSquare} size={size} {...props} />
)

export const WeatherBadgeIcon = ({ size = 48, ...props }: BadgeProps) => (
  <OverlayBadge src={weatherIcon} size={size} {...props} />
)

export const LocationBadgeIcon = ({ size = 48, ...props }: BadgeProps) => (
  <OverlayBadge src={locationIcon} size={size} {...props} />
)
