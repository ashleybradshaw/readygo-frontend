import { MoreHorizontal } from 'lucide-react'
import { ReadyGoWordmark } from '../ui/BasecampIcons'
import { formatWeatherLine } from '../../lib/session'
import { useReadyGoStore } from '../../store/useReadyGoStore'

interface GuestWeatherHeaderProps {
  dryHours?: number
  onMenuClick?: () => void
  showMenu?: boolean
  showLogo?: boolean
}

export function GuestWeatherHeader({
  dryHours = 3,
  onMenuClick,
  showMenu = true,
  showLogo = true,
}: GuestWeatherHeaderProps) {
  const weather = useReadyGoStore((state) => state.weather)

  return (
    <header className="shrink-0 px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-3">
      {showLogo ? (
        <div className="mb-4 flex items-center justify-center">
          <ReadyGoWordmark />
        </div>
      ) : null}

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
            {formatWeatherLine(weather)}
          </p>
          <p className="mt-1 text-xs font-bold tracking-[-0.01em] text-[#BACBC9]/80">
            Dry for the next [{dryHours}] Hrs
          </p>
        </div>
        {showMenu && onMenuClick ? (
          <button
            type="button"
            tabIndex={0}
            aria-label="More options"
            onClick={onMenuClick}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onMenuClick()
              }
            }}
            className="mt-0.5 flex h-[22px] w-10 shrink-0 items-center justify-center rounded-full bg-[#182629] text-[#BACBC9]"
          >
            <MoreHorizontal className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </header>
  )
}
