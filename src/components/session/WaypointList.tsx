import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Flag,
  Mountain,
} from 'lucide-react'
import type { Waypoint } from '../../store/useReadyGoStore'

interface WaypointListProps {
  waypoints: Waypoint[]
  estimatedLabel: string
  durationLabel: string
}

export function WaypointList({
  waypoints,
  estimatedLabel,
  durationLabel,
}: WaypointListProps) {
  return (
    <div className="flex flex-col gap-0">
      {waypoints.map((waypoint, index) => {
        const next = waypoints[index + 1]
        return (
          <div key={waypoint.id}>
            <div className="flex items-start gap-3 py-3">
              <span
                className={`mt-1 size-2.5 shrink-0 rounded-full ${
                  waypoint.kind === 'start'
                    ? 'bg-[#7CFF00]'
                    : waypoint.kind === 'hard'
                      ? 'bg-rg-red'
                      : waypoint.kind === 'finish'
                        ? 'bg-[#4C8DFF]'
                        : 'bg-rg-text-muted/50'
                }`}
              />
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-md ${
                  waypoint.kind === 'finish'
                    ? 'bg-[#4C8DFF] text-white'
                    : 'bg-[#3A2A1E] text-[#E8C27A]'
                }`}
              >
                <WaypointIcon kind={waypoint.kind} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-rg-text">
                  {waypoint.instruction}
                </p>
                <p className="text-xs text-rg-text-muted">{waypoint.street}</p>
              </div>
            </div>
            {next ? (
              <div className="ml-5 flex items-center gap-2 border-t border-dashed border-rg-text-dim/40 py-2">
                <span className="rounded-full bg-rg-surface px-2 py-0.5 text-[10px] font-bold text-rg-text-muted">
                  {next.distanceMiles.toFixed(1)} mi
                </span>
                {next.kind === 'hard' ? (
                  <span className="rounded-full bg-rg-red/80 px-2 py-0.5 text-[10px] font-bold text-white">
                    Hard Zone
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        )
      })}

      <div className="mt-3 flex gap-2">
        <span className="rounded-full bg-[#7CFF00]/20 px-3 py-1 text-xs font-bold text-[#7CFF00]">
          Est {estimatedLabel}
        </span>
        <span className="rounded-full bg-[#7CFF00]/20 px-3 py-1 text-xs font-bold text-[#7CFF00]">
          {durationLabel}
        </span>
      </div>
    </div>
  )
}

function WaypointIcon({ kind }: { kind: Waypoint['kind'] }) {
  if (kind === 'turn-left') return <ArrowLeft size={16} />
  if (kind === 'turn-right') return <ArrowRight size={16} />
  if (kind === 'straight') return <ArrowUp size={16} />
  if (kind === 'hard') return <Mountain size={16} />
  if (kind === 'finish') return <Flag size={16} />
  return <ArrowUp size={16} />
}
