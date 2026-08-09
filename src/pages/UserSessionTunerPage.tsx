import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { ClosePillButton } from '../components/ui/ClosePillButton'
import { buildSessionManifest } from '../lib/session'
import { useReadyGoStore } from '../store/useReadyGoStore'

const HOUR_PRESETS = [1, 2, 3, 4] as const

export function UserSessionTunerPage() {
  const navigate = useNavigate()
  const hours = useReadyGoStore((state) => state.oneTimeSessionHours)
  const setHours = useReadyGoStore((state) => state.setOneTimeSessionHours)
  const currentProfile = useReadyGoStore((state) => state.currentProfile)
  const weather = useReadyGoStore((state) => state.weather)
  const beginSessionBuild = useReadyGoStore((state) => state.beginSessionBuild)
  const markSessionReady = useReadyGoStore((state) => state.markSessionReady)

  const clampedHours = Math.min(4, Math.max(1, Math.round(hours)))
  const progress = ((clampedHours - 1) / 3) * 100

  const handleClose = () => {
    navigate('/user/basecamp', { replace: true })
  }

  const handleReady = () => {
    if (!currentProfile) {
      navigate('/user/basecamp', { replace: true })
      return
    }

    const session = buildSessionManifest({
      profile: currentProfile,
      weather,
      hours: clampedHours,
    })
    beginSessionBuild(session)
    markSessionReady()
    navigate('/user/session-ready', { replace: true })
  }

  return (
    <div className="relative flex h-full flex-col bg-[#0F1918] px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-6 text-[#BACBC9]">
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-display text-xl font-bold uppercase tracking-[-0.02em]">
          Quick Session
        </h1>
        <ClosePillButton onClick={handleClose} />
      </div>

      <div className="mt-10 flex-1">
        <h2 className="text-center font-display text-base font-bold uppercase tracking-[-0.01em]">
          Time Available
        </h2>
        <p className="mt-1 text-center text-xs font-bold text-[#BACBC9]/70">
          This will only affect your next route.
        </p>

        <div className="mt-8">
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={clampedHours}
            onChange={(event) => setHours(Number(event.target.value))}
            className="guest-param-slider w-full"
            style={{ ['--guest-progress' as string]: `${progress}%` }}
            aria-label="Time available"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {HOUR_PRESETS.map((preset) => {
              const active = clampedHours === preset
              return (
                <button
                  key={preset}
                  type="button"
                  tabIndex={0}
                  aria-pressed={active}
                  onClick={() => setHours(preset)}
                  className={`h-8 rounded-[4px] border px-3 text-xs font-medium tracking-[-0.01em] ${
                    active
                      ? 'border-[#70FF00] bg-[#182629] text-[#70FF00]'
                      : 'border-transparent bg-[#182629] text-[#BACBC9]'
                  }`}
                >
                  {preset} Hour{preset === 1 ? '' : 's'}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <PressableButton
        onClick={handleReady}
        className="rounded-[4px] border-0"
        style={{
          height: 52,
          borderRadius: 4,
          backgroundColor: '#FF3B30',
          color: '#0F1918',
          fontWeight: 700,
        }}
      >
        Ready
      </PressableButton>
    </div>
  )
}
