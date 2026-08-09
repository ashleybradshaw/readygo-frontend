import { Cloud, CloudRain, Sun } from 'lucide-react'
import { BottomSheet } from '../ui/BottomSheet'
import { ClosePillButton } from '../ui/ClosePillButton'
import { PressableButton } from '../ui/PressableButton'
import type { SmartDay } from './SmartWindowBar'

type SlotTone = 'prime' | 'passable' | 'poor'

interface ForecastSlot {
  label: string
  tone: SlotTone
  timeRange: string
  tempC: number
  icon: 'sun' | 'cloud' | 'rain'
  detail: string
}

interface WeatherForecastModalProps {
  open: boolean
  day: SmartDay | null
  location: string
  onClose: () => void
  onGenerateRoute: (day: SmartDay) => void
}

const badgeClass = (tone: SlotTone) => {
  if (tone === 'prime') return 'bg-[#70FF00] text-[#0F1918]'
  if (tone === 'passable') return 'bg-[#F5C518] text-[#0F1918]'
  return 'bg-[#FF3B30] text-white'
}

const buildSlots = (day: SmartDay): ForecastSlot[] => {
  if (day.condition === 'prime') {
    return [
      {
        label: 'Morning',
        tone: 'prime',
        timeRange: '6:00 AM · 10:00 AM',
        tempC: day.tempC,
        icon: 'sun',
        detail: 'Light Breeze',
      },
      {
        label: 'Afternoon',
        tone: 'passable',
        timeRange: '12:00 PM · 4:00 PM',
        tempC: day.tempC + 2,
        icon: 'cloud',
        detail: '40% Chance of Shower',
      },
      {
        label: 'Evening',
        tone: 'poor',
        timeRange: '6:00 PM · 10:00 PM',
        tempC: day.tempC - 2,
        icon: 'rain',
        detail: 'Heavy Rain',
      },
    ]
  }

  if (day.condition === 'passable') {
    return [
      {
        label: 'Morning',
        tone: 'passable',
        timeRange: '6:00 AM · 10:00 AM',
        tempC: day.tempC - 1,
        icon: 'cloud',
        detail: 'Broken Cloud',
      },
      {
        label: 'Afternoon',
        tone: 'prime',
        timeRange: '12:00 PM · 4:00 PM',
        tempC: day.tempC + 1,
        icon: 'sun',
        detail: 'Light Breeze',
      },
      {
        label: 'Evening',
        tone: 'poor',
        timeRange: '6:00 PM · 10:00 PM',
        tempC: day.tempC - 2,
        icon: 'rain',
        detail: 'Showers Likely',
      },
    ]
  }

  return [
    {
      label: 'Morning',
      tone: 'poor',
      timeRange: '6:00 AM · 10:00 AM',
      tempC: day.tempC,
      icon: 'rain',
      detail: 'Steady Rain',
    },
    {
      label: 'Afternoon',
      tone: 'poor',
      timeRange: '12:00 PM · 4:00 PM',
      tempC: day.tempC + 1,
      icon: 'rain',
      detail: '40% Chance of Shower',
    },
    {
      label: 'Evening',
      tone: 'passable',
      timeRange: '6:00 PM · 10:00 PM',
      tempC: day.tempC - 1,
      icon: 'cloud',
      detail: 'Clearing Later',
    },
  ]
}

const kitForSlots = (slots: ForecastSlot[]) => {
  const kits: string[] = []
  const hasRain = slots.some((slot) => slot.icon === 'rain')
  const cool = slots.some((slot) => slot.tempC <= 14)
  if (cool || hasRain) kits.push('Light Windbreaker')
  if (hasRain || slots.some((slot) => slot.label === 'Evening')) {
    kits.push('Rear Light')
  }
  if (kits.length === 0) kits.push('Light Layers')
  return kits
}

const SlotIcon = ({ icon }: { icon: ForecastSlot['icon'] }) => {
  if (icon === 'rain') return <CloudRain size={14} aria-hidden="true" />
  if (icon === 'cloud') return <Cloud size={14} aria-hidden="true" />
  return <Sun size={14} aria-hidden="true" />
}

export const WeatherForecastModal = ({
  open,
  day,
  location,
  onClose,
  onGenerateRoute,
}: WeatherForecastModalProps) => {
  if (!day) return null

  const slots = buildSlots(day)
  const kits = kitForSlots(slots)
  const primeSlot = slots.find((slot) => slot.tone === 'prime') ?? slots[0]
  const primeWindow = `Prime Window: ${primeSlot.timeRange.replace(' · ', ' – ')}`

  return (
    <BottomSheet open={open} onClose={onClose} tone="dark">
      <div className="flex flex-col gap-5 pb-2 pt-1 text-[#BACBC9]">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-xl font-bold uppercase tracking-[-0.02em]">
            Weather Forecast.
          </h2>
          <ClosePillButton onClick={onClose} />
        </div>

        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-[#BACBC9]/80">
            {day.dayName} · {location}
          </p>
          <p className="mt-1 text-xs font-bold text-[#BACBC9]/70">
            {primeWindow}
          </p>
        </div>

        <div className="space-y-4">
          {slots.map((slot) => (
            <div key={slot.label} className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex h-8 items-center rounded-[4px] px-3 text-xs font-medium ${badgeClass(slot.tone)}`}
                >
                  {slot.label}
                </span>
                <span className="inline-flex h-8 items-center rounded-[4px] bg-[#182629] px-3 text-xs font-medium text-[#BACBC9]">
                  {slot.timeRange}
                </span>
                <span className="inline-flex h-8 items-center rounded-[4px] bg-[#182629] px-3 text-xs font-medium text-[#BACBC9]">
                  {slot.tempC}°
                </span>
                <span className="inline-flex size-8 items-center justify-center rounded-[4px] bg-[#182629] text-[#BACBC9]">
                  <SlotIcon icon={slot.icon} />
                </span>
              </div>
              <span className="inline-flex h-8 items-center rounded-[4px] bg-[#182629] px-3 text-xs font-medium text-[#BACBC9]">
                {slot.detail}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-[#2D3739] pt-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-[#BACBC9]/70">
            Kit Suggestion
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {kits.map((kit) => (
              <span
                key={kit}
                className="inline-flex h-8 items-center rounded-[4px] bg-[#182629] px-3 text-xs font-medium text-[#BACBC9]"
              >
                {kit}
              </span>
            ))}
          </div>
        </div>

        <PressableButton
          onClick={() => onGenerateRoute(day)}
          className="rounded-[4px] border-0"
          style={{
            height: 52,
            borderRadius: 4,
            backgroundColor: '#F5F7F7',
            color: '#0F1918',
            fontWeight: 700,
          }}
        >
          Generate Route
        </PressableButton>
      </div>
    </BottomSheet>
  )
}
