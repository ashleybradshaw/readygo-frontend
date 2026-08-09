import { MoreHorizontal } from 'lucide-react'
import { ReadyGoWordmark } from './ui/BasecampIcons'
import { formatWeatherLine } from '../lib/session'
import { useReadyGoStore } from '../store/useReadyGoStore'

interface AppHeaderProps {
  locationLabel?: string
  temperatureC?: number | null
  condition?: string
  dryHours?: number
  onMenuClick?: () => void
  showMenu?: boolean
  showWeather?: boolean
}

export function AppHeader({
  locationLabel,
  temperatureC,
  condition,
  dryHours,
  onMenuClick,
  showMenu = true,
  showWeather = true,
}: AppHeaderProps) {
  const weather = useReadyGoStore((state) => state.weather)

  const weatherLine = formatWeatherLine({
    location: locationLabel ?? weather.location,
    temperatureC: temperatureC ?? weather.temperatureC,
    condition: condition ?? weather.condition,
  })

  const showWeatherRow = showWeather || (showMenu && Boolean(onMenuClick))

  return (
    <header className="shrink-0 px-5 pt-[65px] pb-2">
      <div className={`flex items-center justify-center ${showWeatherRow ? 'pb-5' : 'pb-2'}`}>
        <ReadyGoWordmark />
      </div>

      {showWeatherRow ? (
        <div className="relative flex min-h-6 items-start justify-center px-2">
          {showWeather ? (
            <div className="min-w-0 text-center">
              <p className="truncate text-sm font-bold leading-[18px] tracking-[-0.01em] text-[#BACBC9]">
                {weatherLine}
              </p>
              {typeof dryHours === 'number' ? (
                <p className="mt-1 text-xs font-bold tracking-[-0.01em] text-[#BACBC9]/80">
                  Dry for the next [{dryHours}] Hrs
                </p>
              ) : null}
            </div>
          ) : null}
          {showMenu && onMenuClick ? (
            <button
              type="button"
              aria-label="More options"
              onClick={onMenuClick}
              className="absolute right-0 top-0 flex h-[22px] w-10 shrink-0 items-center justify-center rounded-full bg-[#182629] text-[#BACBC9] transition-colors hover:text-white"
            >
              <MoreHorizontal className="h-5 w-5" strokeWidth={2.25} />
            </button>
          ) : null}
        </div>
      ) : null}
    </header>
  )
}

export function ReadyGoLogo() {
  return <ReadyGoWordmark />
}
