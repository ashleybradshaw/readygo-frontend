import type { ReactNode } from 'react'
import {
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from 'lucide-react'
import { ToggleSwitch } from '../ui/ToggleSwitch'
import type { WeatherChoice } from '../../store/useReadyGoStore'

export const QuestionSectionStack = ({
  children,
}: {
  children: ReactNode
}) => (
  <div className="overflow-hidden rounded-[10px] border border-[#39484A] bg-[#182629] divide-y divide-[#39484A] [&>[data-section-divider]]:border-t-0">
    {children}
  </div>
)

export const QuestionHeaderCard = ({
  icon,
  title,
  body,
}: {
  icon: ReactNode
  title: string
  body: string
}) => (
  <div className="flex gap-3 rounded-t-[10px] rounded-b-none bg-[#182629] p-[16.5px]">
    <div className="flex size-[34px] shrink-0 items-center justify-center rounded-lg bg-[#DCE4E6] text-[#0F191B] [&_img]:size-5 [&_svg]:size-5">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <h2 className="font-sans text-sm font-bold capitalize leading-5 tracking-[-1px] text-[#BACBC9]">
        {title}
      </h2>
      <p className="mt-1 font-sans text-sm leading-5 text-[#BACBC9]">{body}</p>
    </div>
  </div>
)

export const QuestionToggleRow = ({
  label,
  checked,
  onChange,
  leading,
  roundBottom = false,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  leading?: ReactNode
  roundBottom?: boolean
}) => (
  <div
    className={`flex items-center justify-between gap-3 bg-[#182629] px-5 py-5 ${
      roundBottom ? 'rounded-b-[10px] rounded-t-none' : 'rounded-none'
    }`}
  >
    <div className="flex min-w-0 flex-1 items-center gap-3">
      {leading ? <span className="shrink-0">{leading}</span> : null}
      <span className="font-sans text-sm font-bold capitalize leading-5 tracking-[-1px] text-[#BACBC9]">
        {label}
      </span>
    </div>
    <ToggleSwitch label={label} checked={checked} onChange={onChange} />
  </div>
)

export const QuestionSectionDivider = () => (
  <div
    data-section-divider
    className="bg-[#182629] px-5 py-0"
    aria-hidden="true"
  >
    <div className="border-t border-dashed border-[#647A7C]/60" />
  </div>
)

const weatherIconMap: Record<
  WeatherChoice,
  typeof Sun
> = {
  'Only sunshine': Sun,
  'Only when dry': CloudSun,
  'Bit of drizzle': CloudDrizzle,
  'Light rain': CloudRain,
  'Cats and dogs': CloudLightning,
  'Cold or snow': CloudSnow,
}

export const WeatherConditionBadge = ({
  choice,
}: {
  choice: WeatherChoice
}) => {
  const Icon = weatherIconMap[choice]
  return (
    <span
      className="inline-flex size-7 items-center justify-center rounded-[6px] bg-[#0F191B] text-[#BACBC9]"
      aria-hidden="true"
    >
      <Icon size={16} strokeWidth={1.75} />
    </span>
  )
}
