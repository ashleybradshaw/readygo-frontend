import { Home, MapPinned, Settings } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GuestWeatherHeader } from '../components/guest/GuestWeatherHeader'
import { GuestBasecampMenuModal } from '../components/guest/GuestBasecampMenuModal'
import { PressableButton } from '../components/ui/PressableButton'
import { formatDuration } from '../lib/session'
import { showSuccessToast } from '../components/overlays/NotificationHost'
import { useReadyGoStore } from '../store/useReadyGoStore'

type DayKind = 'inactive' | 'checked' | 'session'

const ACTIVITY_NODES: DayKind[] = [
  'session',
  'checked',
  'session',
  'inactive',
  'checked',
  'session',
  'checked',
  'inactive',
  'session',
  'checked',
  'inactive',
  'checked',
  'session',
  'checked',
  'session',
  'inactive',
  'checked',
  'inactive',
  'session',
  'checked',
  'inactive',
  'checked',
  'session',
  'inactive',
  'checked',
  'session',
  'checked',
  'inactive',
  'checked',
  'session',
]

export function GuestBasecampPage() {
  const navigate = useNavigate()
  const session = useReadyGoStore((state) => state.activeSession)
  const currentProfile = useReadyGoStore((state) => state.currentProfile)
  const oneTimeSessionHours = useReadyGoStore((state) => state.oneTimeSessionHours)
  const setGuestSession = useReadyGoStore((state) => state.setGuestSession)
  const [menuOpen, setMenuOpen] = useState(false)

  const preview = useMemo(() => {
    if (session) return session
    return null
  }, [session])

  const handleReady = () => {
    setGuestSession({
      durationHours: oneTimeSessionHours,
      durationLabel:
        oneTimeSessionHours === 1
          ? '1 Hour'
          : `${oneTimeSessionHours} Hours`,
    })
    navigate('/guest/session')
  }

  const handleEditProfile = () => {
    setMenuOpen(false)
    navigate('/guest/session')
  }

  const handleSaveMenu = () => {
    setMenuOpen(false)
    showSuccessToast('Saved', 'Next route length updated for this guest session.')
  }

  const nodeClass = (kind: DayKind) => {
    if (kind === 'session') return 'bg-[#70FF00] shadow-[0_0_8px_rgba(112,255,0,0.55)]'
    if (kind === 'checked') return 'bg-[#BACBC9]'
    return 'border border-[#2D3739] bg-transparent'
  }

  return (
    <div className="relative flex h-full flex-col bg-[#0F1918]">
      <GuestWeatherHeader
        dryHours={preview?.weatherStableHours ?? 3}
        onMenuClick={() => setMenuOpen(true)}
      />

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 pb-4">
        <section className="rounded-[4px] bg-[#182629] p-4">
          <h2 className="text-base font-bold tracking-[-0.01em] text-[#BACBC9]">
            {preview?.title ?? 'Your next route'}
          </h2>
          <div className="mt-3 flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-[#0F1918] text-[#BACBC9]">
              <MapPinned size={16} aria-hidden="true" />
            </div>
            <div className="space-y-1 text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
              <p>
                Distance:{' '}
                <span className="text-[#BACBC9]/80">
                  {preview
                    ? `${preview.distanceKm}Km (${preview.distanceMiles} Miles)`
                    : '—'}
                </span>
              </p>
              <p>
                Start/Finish:{' '}
                <span className="text-[#BACBC9]/80">
                  {preview
                    ? `${preview.startLocation} To ${preview.endLocation}`
                    : '—'}
                </span>
              </p>
              <p>
                Est. Time:{' '}
                <span className="text-[#BACBC9]/80">
                  {preview ? formatDuration(preview.estimatedMinutes) : '—'}
                </span>
              </p>
              <p>
                Terrain:{' '}
                <span className="text-[#BACBC9]/80">
                  {preview?.terrain ?? currentProfile?.activityType ?? '—'}
                </span>
              </p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="font-display text-base font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
            Unlock Full Performance
          </h2>
          <p className="mt-2 font-sans text-sm leading-relaxed text-[#BACBC9]">
            Sign up in 10 seconds to save this{' '}
            <span className="font-bold text-[#70FF00]">
              {preview ? `${preview.distanceMiles} mi` : '15.2 mi'}
            </span>{' '}
            route, track your 30-day streak, and unlock 7-day weather windows.
          </p>
          <PressableButton
            onClick={() => navigate('/auth/terms')}
            className="mt-4 rounded-full border-0"
            style={{
              height: 48,
              borderRadius: 999,
              backgroundColor: '#B59473',
              color: '#0F1918',
              fontWeight: 700,
            }}
          >
            Create Free Account
          </PressableButton>
        </section>

        <section className="text-center">
          <h2 className="font-display text-base font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
            30 Day Activity
          </h2>
          <p className="mt-1 text-xs font-bold text-[#BACBC9]/80">
            42.5 mi · 10 Sessions
          </p>
          <div className="mx-auto mt-4 space-y-1.5">
            {[0, 1].map((row) => (
              <div key={row} className="flex justify-center gap-1.5">
                {ACTIVITY_NODES.slice(row * 15, row * 15 + 15).map((kind, index) => (
                  <span
                    key={`${row}-${index}`}
                    className={`size-2.5 rounded-full ${nodeClass(kind)}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-bold text-[#BACBC9]/80">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full border border-[#2D3739]" />
              Inactive
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#BACBC9]" />
              Checked in
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#70FF00]" />
              Session
            </span>
          </div>
        </section>
      </div>

      <div className="px-5 pb-3">
        <PressableButton
          onClick={handleReady}
          className="rounded-[4px] border-0"
          style={{
            height: 56,
            borderRadius: 4,
            backgroundColor: '#FF3B30',
            color: '#0F1918',
            fontWeight: 700,
          }}
        >
          Ready
        </PressableButton>
      </div>

      <nav
        aria-label="Guest navigation"
        className="flex items-center justify-around border-t border-[#182629] px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
      >
        <button
          type="button"
          tabIndex={0}
          aria-current="page"
          className="inline-flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[#70FF00]"
        >
          <Home size={18} aria-hidden="true" />
          Basecamp
        </button>
        <button
          type="button"
          tabIndex={0}
          aria-label="Settings"
          onClick={() => navigate('/auth/terms')}
          className="inline-flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[#829695]"
        >
          <Settings size={18} aria-hidden="true" />
          Settings
        </button>
      </nav>

      <GuestBasecampMenuModal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onEditProfile={handleEditProfile}
        onSave={handleSaveMenu}
      />
    </div>
  )
}
