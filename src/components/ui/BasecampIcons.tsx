import type { ImgHTMLAttributes } from 'react'
import logoReadyGo from '../../assets/basecamp/logo-readygo.svg'
import iconLocation from '../../assets/basecamp/icon-location.svg'
import iconTime from '../../assets/basecamp/icon-time.svg'
import iconGoai from '../../assets/basecamp/icon-goai.svg'
import iconWeather from '../../assets/basecamp/icon-weather.svg'
import iconClothing from '../../assets/basecamp/icon-clothing.svg'
import iconMaps from '../../assets/basecamp/icon-maps.svg'
import iconList from '../../assets/basecamp/icon-list.svg'
import iconInfo from '../../assets/basecamp/icon-info.svg'
import iconDocument from '../../assets/basecamp/icon-document.svg'
import iconPath from '../../assets/basecamp/icon-path.svg'
import iconGrid from '../../assets/basecamp/icon-grid.svg'
import iconReturn from '../../assets/basecamp/icon-return.svg'

type IconProps = {
  className?: string
  size?: number
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>

function BasecampImg({
  src,
  size = 24,
  className = '',
  ...props
}: IconProps & { src: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      style={{ width: size, height: size }}
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
}

export function ReadyGoWordmark({ className = '' }: { className?: string }) {
  return (
    <img
      src={logoReadyGo}
      alt="ReadyGo"
      width={231}
      height={46}
      className={`h-[46px] w-auto max-w-[231px] object-contain ${className}`}
      draggable={false}
    />
  )
}

export function LocationCardIcon(props: IconProps) {
  return <BasecampImg src={iconLocation} {...props} />
}

export function TimeCardIcon(props: IconProps) {
  return <BasecampImg src={iconTime} {...props} />
}

export function GoaiCardIcon(props: IconProps) {
  return <BasecampImg src={iconGoai} {...props} />
}

export function WeatherCardIcon(props: IconProps) {
  return <BasecampImg src={iconWeather} {...props} />
}

export function ClothingCardIcon(props: IconProps) {
  return <BasecampImg src={iconClothing} {...props} />
}

export function MapsCardIcon(props: IconProps) {
  return <BasecampImg src={iconMaps} {...props} />
}

export function ListCardIcon(props: IconProps) {
  return <BasecampImg src={iconList} {...props} />
}

export function InfoCalloutIcon(props: IconProps) {
  return <BasecampImg src={iconInfo} size={16} {...props} />
}

export function DocumentFeatureIcon(props: IconProps) {
  return <BasecampImg src={iconDocument} size={16} {...props} />
}

export function PathFeatureIcon(props: IconProps) {
  return <BasecampImg src={iconPath} size={16} {...props} />
}

export function GridFeatureIcon(props: IconProps) {
  return <BasecampImg src={iconGrid} size={16} {...props} />
}

export function ProfileReturnIcon(props: IconProps) {
  return <BasecampImg src={iconReturn} size={44} className="size-11" {...props} />
}
