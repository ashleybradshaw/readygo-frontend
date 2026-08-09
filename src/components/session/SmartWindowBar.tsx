import { Cloud, CloudRain, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export type WindowCondition = 'prime' | 'passable' | 'poor'

export interface SmartDay {
  id: string
  label: string
  tempC: number
  condition: WindowCondition
  icon: 'sun' | 'cloud' | 'rain'
  dayName: string
}

interface SmartWindowBarProps {
  days: SmartDay[]
  bestWindowLabel: string
  showDayOneIntro?: boolean
  onDayClick: (day: SmartDay) => void
  onIntroComplete?: () => void
}

const ringClass = (condition: WindowCondition) => {
  if (condition === 'prime') return 'text-[#70FF00] ring-[#70FF00]'
  if (condition === 'passable') return 'text-[#F5C518] ring-[#F5C518]'
  return 'text-[#BACBC9]/55 ring-[#39484A]'
}

const WeatherIcon = ({
  icon,
  className,
}: {
  icon: SmartDay['icon']
  className?: string
}) => {
  if (icon === 'rain') return <CloudRain size={14} className={className} aria-hidden="true" />
  if (icon === 'cloud') return <Cloud size={14} className={className} aria-hidden="true" />
  return <Sun size={14} className={className} aria-hidden="true" />
}

export const SmartWindowBar = ({
  days,
  bestWindowLabel,
  showDayOneIntro = false,
  onDayClick,
  onIntroComplete,
}: SmartWindowBarProps) => {
  const [pulse, setPulse] = useState(showDayOneIntro)
  const [tooltipVisible, setTooltipVisible] = useState(showDayOneIntro)

  useEffect(() => {
    if (!showDayOneIntro) return

    setPulse(true)
    setTooltipVisible(true)

    const pulseTimer = window.setTimeout(() => setPulse(false), 2000)
    const tooltipTimer = window.setTimeout(() => {
      setTooltipVisible(false)
      onIntroComplete?.()
    }, 3500)

    return () => {
      window.clearTimeout(pulseTimer)
      window.clearTimeout(tooltipTimer)
    }
  }, [onIntroComplete, showDayOneIntro])

  return (
    <section className="relative text-center">
      {tooltipVisible ? (
        <div
          className="pointer-events-none absolute -top-2 left-1/2 z-10 w-[min(100%,320px)] -translate-x-1/2 -translate-y-full rounded-[4px] bg-[#182629] px-3 py-2 text-left shadow-[0_0_0_1px_rgba(112,255,0,0.35)] animate-smart-tooltip"
          role="status"
        >
          <p className="text-[11px] font-medium leading-snug text-[#BACBC9]">
            ✨ Personalized forecast active! We&apos;ve highlighted your best
            weather windows for the week.
          </p>
        </div>
      ) : null}

      <div
        className={`rounded-[4px] bg-[#182629] px-3 py-4 ${
          pulse ? 'animate-smart-pulse' : ''
        }`}
      >
        <h2 className="font-display text-base font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
          7-Day Smart Window
        </h2>
        <p className="mt-1 text-xs font-bold text-[#BACBC9]/80">
          {bestWindowLabel}
        </p>

        <div className="mt-4 flex items-start justify-between gap-1">
          {days.map((day) => {
            const tone = ringClass(day.condition)
            return (
              <button
                key={day.id}
                type="button"
                tabIndex={0}
                aria-label={`Open weather forecast for ${day.dayName}`}
                onClick={() => onDayClick(day)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onDayClick(day)
                  }
                }}
                className={`flex flex-1 flex-col items-center gap-1.5 ${tone.split(' ')[0]}`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wide">
                  {day.label}
                </span>
                <span
                  className={`flex size-8 items-center justify-center rounded-full bg-[#0F1918] ring-1 ${tone}`}
                >
                  <WeatherIcon icon={day.icon} />
                </span>
                <span className="text-[10px] font-bold">{day.tempC}°</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
