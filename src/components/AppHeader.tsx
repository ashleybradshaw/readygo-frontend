import { MoreHorizontal } from 'lucide-react'
import { formatWeatherLine } from '../lib/session'
import { useReadyGoStore } from '../store/useReadyGoStore'

interface AppHeaderProps {
  locationLabel?: string
  temperatureC?: number | null
  condition?: string
  onMenuClick?: () => void
}

export function AppHeader({
  locationLabel,
  temperatureC,
  condition,
  onMenuClick,
}: AppHeaderProps) {
  const weather = useReadyGoStore((state) => state.weather)

  const weatherLine = formatWeatherLine({
    location: locationLabel ?? weather.location,
    temperatureC: temperatureC ?? weather.temperatureC,
    condition: condition ?? weather.condition,
  })

  return (
    <header className="shrink-0 px-5 pt-3 pb-2">
      <div className="flex h-[72px] items-center justify-center">
        <ReadyGoLogo />
      </div>

      <div className="flex h-10 items-center gap-2.5 px-5">
        <p className="min-w-0 flex-1 truncate text-sm font-bold leading-[18px] text-rg-text-muted">
          {weatherLine}
        </p>
        <button
          type="button"
          aria-label="More options"
          onClick={onMenuClick}
          className="flex h-[22px] w-10 shrink-0 items-center justify-center rounded-full bg-rg-surface text-rg-text-muted transition-colors hover:text-rg-text"
        >
          <MoreHorizontal size={16} strokeWidth={2.25} />
        </button>
      </div>
    </header>
  )
}

export function ReadyGoLogo() {
  return (
    <div
      className="flex items-center gap-0.5 font-display text-[28px] font-semibold tracking-tight text-rg-text uppercase"
      aria-label="ReadyGo"
    >
      <span>Ready</span>
      <span className="relative inline-flex items-center">
        <span>G</span>
        <span className="relative ml-0.5 inline-flex h-[0.72em] w-[0.72em] items-center justify-center">
          <span className="absolute h-[2px] w-full rotate-[-28deg] rounded-full bg-rg-lime" />
          <span className="absolute h-[2px] w-full translate-y-[5px] rotate-[-28deg] rounded-full bg-rg-red" />
        </span>
      </span>
    </div>
  )
}
