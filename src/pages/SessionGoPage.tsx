import { Bike, Footprints, Map, MapPinned, Minus, Plus, Shuffle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { PressableButton } from '../components/ui/PressableButton'
import { ToggleSwitch } from '../components/ui/ToggleSwitch'
import { ViewMapModal } from '../components/session/ViewMapModal'
import { SessionMenuModal } from '../components/session/SessionMenuModal'
import { SaveSessionModal } from '../components/session/SaveSessionModal'
import { GlobalLoadingScreen } from '../components/ui/GlobalLoadingScreen'
import { formatDuration, rebuildSession } from '../lib/session'
import { showSuccessToast } from '../components/overlays/NotificationHost'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function SessionGoPage() {
  const navigate = useNavigate()
  const session = useReadyGoStore((state) => state.activeSession)
  const currentProfile = useReadyGoStore((state) => state.currentProfile)
  const weather = useReadyGoStore((state) => state.weather)
  const updateActiveSession = useReadyGoStore((state) => state.updateActiveSession)
  const clearSession = useReadyGoStore((state) => state.clearSession)
  const saveCompletedSession = useReadyGoStore(
    (state) => state.saveCompletedSession,
  )
  const isGuest = useReadyGoStore((state) => state.isGuest)
  const [mapOpen, setMapOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [savedOpen, setSavedOpen] = useState(false)
  const [rebuilding, setRebuilding] = useState(false)

  useEffect(() => {
    if (!session || !currentProfile) {
      navigate(isGuest ? '/guest/activity' : '/', { replace: true })
    }
  }, [currentProfile, isGuest, navigate, session])

  if (!session || !currentProfile) return null

  const ActivityIcon =
    currentProfile.activityType === 'Cycle' ? Bike : Footprints

  const handleRebuild = (direction: 'shorter' | 'longer' | 'remix') => {
    setRebuilding(true)
    window.setTimeout(() => {
      if (direction === 'remix') {
        updateActiveSession(
          rebuildSession(rebuildSession(session, 'longer'), 'shorter'),
        )
      } else {
        updateActiveSession(rebuildSession(session, direction))
      }
      setRebuilding(false)
    }, 600)
  }

  const handleShareMap = () => {
    setMenuOpen(false)
    setMapOpen(true)
  }

  const handleSaveSession = () => {
    setMenuOpen(false)
    saveCompletedSession(4)
    setSavedOpen(true)
  }

  const handleCancelSession = () => {
    setMenuOpen(false)
    clearSession()
    if (isGuest) {
      navigate('/guest/basecamp', { replace: true })
      return
    }
    navigate('/user/basecamp', { replace: true })
  }

  const modifierClass =
    'inline-flex h-8 items-center justify-center gap-1.5 rounded-[4px] bg-[#BACBC9] px-3 text-xs font-medium tracking-[-0.01em] text-[#0F1918]'

  return (
    <div className="relative flex h-full flex-col bg-[#0F1918]">
      <AppHeader
        locationLabel={weather.location}
        temperatureC={weather.temperatureC}
        condition={weather.condition}
        dryHours={session.weatherStableHours}
        showMenu
        onMenuClick={() => setMenuOpen(true)}
      />

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 pb-5">
        <section className="rounded-[4px] bg-[#182629] p-4">
          <h1 className="text-base font-bold tracking-[-0.01em] text-[#BACBC9]">
            {session.title}
          </h1>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <ActivityIcon
                className="h-5 w-5 shrink-0 text-[#70FF00]"
                aria-hidden="true"
              />
              <p className="truncate text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
                {currentProfile.name}
              </p>
            </div>
            <button
              type="button"
              tabIndex={0}
              aria-label="Switch profile"
              onClick={() =>
                showSuccessToast(
                  'Profile locked',
                  'Finish or cancel this session to switch.',
                )
              }
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-[4px] bg-[#F5F7F7] px-4 text-xs font-medium text-[#0F1918]"
            >
              Switch
            </button>
          </div>
        </section>

        <section className="rounded-[4px] bg-[#182629] p-4">
          <h2 className="text-base font-bold tracking-[-0.01em] text-[#BACBC9]">
            {session.title}
          </h2>

          <div className="mt-4 flex items-start gap-3">
            <MapPinned
              size={18}
              className="mt-0.5 shrink-0 text-[#BACBC9]"
              aria-hidden="true"
            />
            <div className="space-y-1.5 text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
              <p>
                Distance:{' '}
                <span className="text-[#BACBC9]/80">
                  {session.distanceKm}Km ({session.distanceMiles} Miles)
                </span>
              </p>
              <p>
                Start/Finish:{' '}
                <span className="text-[#BACBC9]/80">
                  {session.startLocation} To {session.endLocation}
                </span>
              </p>
              <p>
                Est. Time:{' '}
                <span className="text-[#BACBC9]/80">
                  {formatDuration(session.estimatedMinutes)}
                </span>
              </p>
              <p>
                Terrain:{' '}
                <span className="text-[#BACBC9]/80">{session.terrain}</span>
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              tabIndex={0}
              aria-label="Make shorter"
              onClick={() => handleRebuild('shorter')}
              className={modifierClass}
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
              Make shorter
            </button>
            <button
              type="button"
              tabIndex={0}
              aria-label="Make longer"
              onClick={() => handleRebuild('longer')}
              className={modifierClass}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Make longer
            </button>
            <button
              type="button"
              tabIndex={0}
              aria-label="Remix"
              onClick={() => handleRebuild('remix')}
              className={modifierClass}
            >
              <Shuffle className="h-4 w-4" aria-hidden="true" />
              Remix
            </button>
            <button
              type="button"
              tabIndex={0}
              aria-label="View Map"
              onClick={() => setMapOpen(true)}
              className={modifierClass}
            >
              <Map className="h-4 w-4" aria-hidden="true" />
              View Map
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#39484A] pt-4">
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
        </section>
      </div>

      <div className="px-5 pb-6">
        <PressableButton
          onClick={() => navigate('/user/loading')}
          className="rounded-[4px] border-0"
          style={{
            height: 56,
            borderRadius: 4,
            backgroundColor: '#70FF00',
            color: '#0F1918',
            fontWeight: 700,
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
      <SaveSessionModal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        onBasecamp={() => {
          setSavedOpen(false)
          clearSession()
          navigate(isGuest ? '/guest/basecamp' : '/', { replace: true })
        }}
      />
      <GlobalLoadingScreen
        overlay
        open={rebuilding}
        ariaLabel="Rebuilding route"
      />
    </div>
  )
}
