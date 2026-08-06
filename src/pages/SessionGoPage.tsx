import { ChevronDown, ChevronUp, Cloud, Clock3, MapPinned } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { PressableButton } from '../components/ui/PressableButton'
import { ToggleSwitch } from '../components/ui/ToggleSwitch'
import { ProfileOverviewCard } from '../components/session/ProfileOverviewCard'
import { ViewMapModal } from '../components/session/ViewMapModal'
import { GoaiLoader } from '../components/session/GoaiLoader'
import { SessionMenuModal } from '../components/session/SessionMenuModal'
import { GoaiCardIcon } from '../components/ui/BasecampIcons'
import { formatDuration, formatWeatherLine, rebuildSession } from '../lib/session'
import { showSuccessToast } from '../components/overlays/NotificationHost'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function SessionGoPage() {
  const navigate = useNavigate()
  const session = useReadyGoStore((state) => state.activeSession)
  const currentProfile = useReadyGoStore((state) => state.currentProfile)
  const savedRoutes = useReadyGoStore((state) => state.savedRoutes)
  const weather = useReadyGoStore((state) => state.weather)
  const updateActiveSession = useReadyGoStore((state) => state.updateActiveSession)
  const clearSession = useReadyGoStore((state) => state.clearSession)
  const [mapOpen, setMapOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [rebuilding, setRebuilding] = useState(false)

  useEffect(() => {
    if (!session || !currentProfile) {
      navigate('/', { replace: true })
    }
  }, [currentProfile, navigate, session])

  if (!session || !currentProfile) return null

  const handleRebuild = (direction: 'shorter' | 'longer') => {
    setRebuilding(true)
    window.setTimeout(() => {
      updateActiveSession(rebuildSession(session, direction))
      setRebuilding(false)
    }, 900)
  }

  const handleShareMap = () => {
    setMenuOpen(false)
    setMapOpen(true)
  }

  const handleSaveSession = () => {
    setMenuOpen(false)
    showSuccessToast('Session saved', 'Find it anytime in Saved.')
  }

  const handleCancelSession = () => {
    setMenuOpen(false)
    clearSession()
    navigate('/', { replace: true })
  }

  return (
    <div className="relative flex h-full flex-col bg-[#0F1918]">
      <AppHeader
        locationLabel={weather.location}
        temperatureC={weather.temperatureC}
        condition={weather.condition}
        showMenu
        onMenuClick={() => setMenuOpen(true)}
      />

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 pb-5">
        <ProfileOverviewCard
          profile={currentProfile}
          savedRoutesCount={savedRoutes.length}
          isActive
        />

        <div className="flex items-center gap-3 rounded-[10px] border border-[#39484A] bg-[#182629] px-4 py-3">
          <GoaiCardIcon size={28} />
          <p className="text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
            GOAI Built This Session.
          </p>
        </div>

        <div className="rounded-[10px] border border-[#39484A] bg-[#182629] px-4 py-3">
          <p className="text-base font-bold tracking-[-0.01em] text-[#BACBC9]">
            {session.title}
          </p>
        </div>

        <div className="flex items-start gap-3 rounded-[10px] border border-[#39484A] bg-[#182629] px-4 py-3">
          <Cloud size={18} className="mt-0.5 shrink-0 text-[#BACBC9]" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
              No change for around [{session.weatherStableHours}] hours.
            </p>
            <p className="mt-1 text-xs font-bold tracking-[-0.01em] text-[#BACBC9]/80">
              {formatWeatherLine(weather)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-[10px] border border-[#39484A] bg-[#182629] px-4 py-3">
          <Clock3 size={18} className="mt-0.5 shrink-0 text-[#BACBC9]" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
              Estimated:
            </p>
            <p className="mt-1 text-base font-bold tracking-[-0.01em] text-[#BACBC9]">
              [{formatDuration(session.estimatedMinutes)}]
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-[10px] border border-[#39484A] bg-[#182629] px-4 py-3">
          <MapPinned size={18} className="mt-0.5 shrink-0 text-[#BACBC9]" aria-hidden="true" />
          <div className="space-y-1 text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
            <p>
              Distance:{' '}
              <span className="text-[#BACBC9]/80">
                [{session.distanceKm}]Km ([{session.distanceMiles}] Miles)
              </span>
            </p>
            <p>
              Start/Finish:{' '}
              <span className="text-[#BACBC9]/80">
                [{session.startLocation}] To [{session.endLocation}]
              </span>
            </p>
            <p>
              Difficulty:{' '}
              <span className="text-[#BACBC9]/80">[{session.difficulty}]</span>
            </p>
            <p>
              Terrain:{' '}
              <span className="text-[#BACBC9]/80">[{session.terrain}]</span>
            </p>
          </div>
        </div>

        <div className="rounded-[10px] border border-[#39484A] bg-[#182629] p-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              tabIndex={0}
              aria-label="Rebuild shorter"
              onClick={() => handleRebuild('shorter')}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleRebuild('shorter')
                }
              }}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[#DCE4E2] px-3 text-xs font-bold tracking-[-0.01em] text-[#0F191B]"
            >
              <ChevronDown size={14} aria-hidden="true" />
              Rebuild shorter
            </button>
            <button
              type="button"
              tabIndex={0}
              aria-label="Rebuild longer"
              onClick={() => handleRebuild('longer')}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleRebuild('longer')
                }
              }}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[#DCE4E2] px-3 text-xs font-bold tracking-[-0.01em] text-[#0F191B]"
            >
              <ChevronUp size={14} aria-hidden="true" />
              Rebuild longer
            </button>
          </div>
        </div>

        <button
          type="button"
          tabIndex={0}
          aria-label="View map"
          onClick={() => setMapOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              setMapOpen(true)
            }
          }}
          className="flex h-8 w-full items-center justify-center rounded-full bg-[#DCE4E2] text-sm font-bold tracking-[-0.01em] text-[#0F191B]"
        >
          View map
        </button>

        <div className="flex items-center justify-between rounded-[10px] border border-[#39484A] bg-[#182629] px-4 py-3">
          <span className="text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
            Show Map While App Is Open
          </span>
          <ToggleSwitch
            label="Show Map While App Is Open"
            checked={session.showMapWhileOpen}
            onChange={(checked) =>
              updateActiveSession({ showMapWhileOpen: checked })
            }
          />
        </div>
      </div>

      <div className="px-5 pb-6">
        <PressableButton
          onClick={() => navigate('/session/loading')}
          className="border-0"
          style={{
            height: 52,
            borderRadius: 12,
            backgroundColor: '#70FF00',
            color: '#0F191B',
          }}
        >
          Go
        </PressableButton>
      </div>

      <ViewMapModal
        open={mapOpen}
        session={session}
        onClose={() => setMapOpen(false)}
      />
      <SessionMenuModal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onShareMap={handleShareMap}
        onSaveSession={handleSaveSession}
        onCancelSession={handleCancelSession}
      />
      <GoaiLoader
        open={rebuilding}
        statusLines={['Adjusting your route...', 'Rechecking distance...']}
        intervalMs={450}
      />
    </div>
  )
}
