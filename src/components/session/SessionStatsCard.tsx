import { Cloud, Clock3, MapPinned } from 'lucide-react'
import type { SessionManifest, WeatherSnapshot } from '../../store/useReadyGoStore'
import { formatDuration, formatWeatherLine } from '../../lib/session'

interface SessionStatsCardProps {
  session: SessionManifest
  weather: WeatherSnapshot
  showWeatherNote?: boolean
}

export function SessionStatsCard({
  session,
  weather,
  showWeatherNote = true,
}: SessionStatsCardProps) {
  return (
    <div className="overflow-hidden rounded-[12px] outline outline-1 outline-[#365466]">
      {showWeatherNote ? (
        <div className="flex items-start gap-3 border-b border-[#365466] bg-rg-surface px-4 py-3">
          <Cloud size={18} className="mt-0.5 shrink-0 text-rg-text" />
          <div>
            <p className="text-sm font-bold text-rg-text">
              No change for around [{session.weatherStableHours}] hours.
            </p>
            <p className="mt-1 text-xs font-bold text-rg-text-muted">
              {formatWeatherLine(weather)}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 border-b border-[#365466] bg-rg-surface px-4 py-3">
          <Cloud size={18} className="shrink-0 text-rg-text" />
          <p className="text-sm font-bold text-rg-text-muted">
            {formatWeatherLine(weather)}
          </p>
        </div>
      )}

      <div className="flex items-center gap-3 border-b border-[#365466] bg-rg-surface px-4 py-3">
        <Clock3 size={18} className="shrink-0 text-rg-text" />
        <p className="text-sm font-bold text-rg-text">
          {showWeatherNote ? 'Estimated: ' : ''}
          [{formatDuration(session.estimatedMinutes)}]
        </p>
      </div>

      <div className="space-y-2 bg-rg-surface px-4 py-3">
        <div className="flex items-start gap-3">
          <MapPinned size={18} className="mt-0.5 shrink-0 text-rg-text" />
          <div className="space-y-1 text-sm font-bold text-rg-text">
            <p>
              Distance:{' '}
              <span className="text-rg-text-muted">
                [{session.distanceKm}]km ([{session.distanceMiles}] miles)
              </span>
            </p>
            <p>
              Start/Finish:{' '}
              <span className="text-rg-text-muted">
                [{session.startLocation}] to [{session.endLocation}]
              </span>
            </p>
            <p>
              Difficulty:{' '}
              <span className="text-rg-text-muted">[{session.difficulty}]</span>
            </p>
            <p>
              Terrain:{' '}
              <span className="text-rg-text-muted">[{session.terrain}]</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
