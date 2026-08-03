import type { SessionManifest } from '../../store/useReadyGoStore'
import { LongPressButton } from './LongPressButton'

interface RouteMapProps {
  session: SessionManifest
  weatherLine?: string
  showEndHold?: boolean
  onEndHold?: () => void
  onClose?: () => void
}

export function RouteMap({
  session,
  weatherLine,
  showEndHold = false,
  onEndHold,
  onClose,
}: RouteMapProps) {
  return (
    <div className="relative overflow-hidden rounded-[18px] bg-[#D7E2C8]">
      <svg viewBox="0 0 360 220" className="h-[220px] w-full">
        <rect width="360" height="220" fill="#D7E2C8" />
        <path
          d="M20 170 C 70 150, 90 90, 140 95 S 210 150, 250 120 S 310 70, 340 85"
          fill="none"
          stroke="#FF3B30"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {session.waypoints.slice(0, 5).map((_, index) => {
          const x = 40 + index * 65
          const y = 160 - (index % 3) * 28
          return <circle key={index} cx={x} cy={y} r="6" fill="#FF3B30" />
        })}
        <g transform="translate(28 150)">
          <path d="M12 0 C5 0 0 6 0 12 C0 20 12 32 12 32 S24 20 24 12 C24 6 19 0 12 0Z" fill="#30D158" />
          <text x="12" y="16" textAnchor="middle" fontSize="8" fill="white" fontWeight="700">
            ▶
          </text>
        </g>
        <rect x="48" y="138" width="42" height="16" rx="4" fill="#30D158" />
        <text x="69" y="149" textAnchor="middle" fontSize="8" fill="white" fontWeight="700">
          START
        </text>
        <circle cx="210" cy="108" r="12" fill="#6B4F3A" />
        <text x="210" y="112" textAnchor="middle" fontSize="10" fill="white">
          ☕
        </text>
        <rect x="228" y="98" width="78" height="18" rx="4" fill="#1C2A33" opacity="0.85" />
        <text x="267" y="110" textAnchor="middle" fontSize="8" fill="#DCE4E6" fontWeight="600">
          Newfold Farm
        </text>
      </svg>

      {onClose ? (
        <button
          type="button"
          aria-label="Close map"
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full bg-rg-base-alt/90 px-3 py-1 text-sm font-bold text-rg-text"
        >
          ✕
        </button>
      ) : null}

      {weatherLine ? (
        <div className="absolute inset-x-4 bottom-4 rounded-full bg-rg-base-alt/85 px-4 py-2 text-center text-xs font-bold text-rg-text-muted backdrop-blur">
          {weatherLine}
        </div>
      ) : null}

      {showEndHold && onEndHold ? (
        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <LongPressButton onComplete={onEndHold} />
        </div>
      ) : null}
    </div>
  )
}
