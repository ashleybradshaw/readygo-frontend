import {
  Bike,
  ChevronLeft,
  ChevronRight,
  Info,
  MapPinned,
  Network,
  Footprints,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { ClosePillButton } from '../components/ui/ClosePillButton'
import { BottomNav } from '../components/BottomNav'
import { ViewMapModal } from '../components/session/ViewMapModal'
import { formatDuration } from '../lib/session'
import { useReadyGoStore } from '../store/useReadyGoStore'
import { showSuccessToast } from '../components/overlays/NotificationHost'

interface SavedPageProps {
  initialTab?: 'sessions' | 'profiles'
}

export function SavedPage({ initialTab }: SavedPageProps) {
  const navigate = useNavigate()
  const savedTab = useReadyGoStore((state) => state.savedTab)
  const setSavedTab = useReadyGoStore((state) => state.setSavedTab)
  const savedRoutes = useReadyGoStore((state) => state.savedRoutes)
  const savedProfiles = useReadyGoStore((state) => state.savedProfiles)
  const currentProfile = useReadyGoStore((state) => state.currentProfile)
  const weather = useReadyGoStore((state) => state.weather)
  const activateProfile = useReadyGoStore((state) => state.activateProfile)
  const deleteProfile = useReadyGoStore((state) => state.deleteProfile)
  const deleteSavedRoute = useReadyGoStore((state) => state.deleteSavedRoute)
  const loadSavedRoute = useReadyGoStore((state) => state.loadSavedRoute)
  const activeSession = useReadyGoStore((state) => state.activeSession)

  const [profileIndex, setProfileIndex] = useState(0)
  const [sessionIndex, setSessionIndex] = useState(0)
  const [mapOpen, setMapOpen] = useState(false)

  useEffect(() => {
    if (initialTab) setSavedTab(initialTab)
  }, [initialTab, setSavedTab])

  const profile = savedProfiles[profileIndex]
  const session = savedRoutes[sessionIndex]
  const isSessions = savedTab === 'sessions'

  return (
    <div className="relative flex h-full flex-col bg-[#0F1918]">
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase leading-8 tracking-[-0.02em] text-[#BACBC9]">
            {isSessions ? 'Saved Sessions' : 'Saved Profiles'}
          </h1>
          <p className="mt-1 font-sans text-sm font-bold uppercase tracking-[-0.01em] text-[#BACBC9]/80">
            {isSessions
              ? `[${savedRoutes.length}]/20 – Saved Routes.`
              : `[${savedProfiles.length}]/5 – Saved Profiles.`}
          </p>
        </div>
        <ClosePillButton onClick={() => navigate('/settings')} />
      </div>

      <SavedTabSwitcher
        active={savedTab}
        onChange={(tab) => {
          setSavedTab(tab)
          navigate(
            tab === 'sessions'
              ? '/settings/saved-sessions'
              : '/settings/saved-profiles',
            { replace: true },
          )
        }}
      />

      {isSessions ? (
        <>
          {savedRoutes.length === 0 ? (
            <EmptyCard
              title="Nothing Here Yet."
              body="Complete a Session and save it – it'll live here for next time."
            />
          ) : session ? (
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
              <section className="rounded-[4px] bg-[#182629] p-4">
                <h2 className="border-b border-[#2D3739] pb-3 text-base font-bold text-[#BACBC9]">
                  {session.name}
                </h2>
                <div className="mt-3 flex items-start gap-3">
                  <MapPinned
                    size={18}
                    className="mt-0.5 shrink-0 text-[#BACBC9]"
                    aria-hidden="true"
                  />
                  <div className="space-y-1 text-sm font-bold text-[#BACBC9]">
                    <p>
                      Distance:{' '}
                      <span className="text-[#BACBC9]/80">
                        {session.distanceKm}Km ({session.distanceMiles} Miles)
                      </span>
                    </p>
                    <p>
                      Start/Finish:{' '}
                      <span className="text-[#BACBC9]/80">
                        {session.startLocation || weather.location} To{' '}
                        {session.endLocation || weather.location}
                      </span>
                    </p>
                    <p>
                      Time:{' '}
                      <span className="text-[#BACBC9]/80">
                        {formatDuration(session.durationMinutes)}
                      </span>
                    </p>
                    <p>
                      Terrain:{' '}
                      <span className="text-[#BACBC9]/80">{session.terrain}</span>
                    </p>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-2 gap-3">
                <PressableButton
                  onClick={() => {
                    const loaded = loadSavedRoute(session.id)
                    if (loaded) navigate('/user/session-ready')
                  }}
                  className="rounded-[4px] border-0"
                  style={{
                    height: 40,
                    borderRadius: 4,
                    backgroundColor: '#70FF00',
                    color: '#0F1918',
                    fontWeight: 700,
                  }}
                >
                  Load session
                </PressableButton>
                <PressableButton
                  onClick={() => {
                    loadSavedRoute(session.id)
                    setMapOpen(true)
                  }}
                  className="rounded-[4px] border-0"
                  style={{
                    height: 40,
                    borderRadius: 4,
                    backgroundColor: '#BACBC9',
                    color: '#0F1918',
                    fontWeight: 700,
                  }}
                >
                  View map
                </PressableButton>
              </div>
              <PressableButton
                onClick={() => {
                  deleteSavedRoute(session.id)
                  setSessionIndex((value) => Math.max(0, value - 1))
                }}
                className="rounded-[4px] border-0"
                style={{
                  height: 40,
                  borderRadius: 4,
                  backgroundColor: '#3B0000',
                  color: '#FF3B30',
                  fontWeight: 700,
                }}
              >
                Delete session
              </PressableButton>
            </div>
          ) : null}

          {savedRoutes.length > 0 ? (
            <CarouselControls
              count={savedRoutes.length}
              index={sessionIndex}
              onChange={setSessionIndex}
            />
          ) : null}
        </>
      ) : (
        <>
          {savedProfiles.length === 0 ? (
            <EmptyCard
              title="No Profiles Saved Yet."
              body="Head to setup to build your first profile."
            />
          ) : profile ? (
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
              <section className="rounded-[4px] bg-[#182629] p-4">
                <h2 className="border-b border-[#2D3739] pb-3 text-base font-bold text-[#BACBC9]">
                  {profile.name}
                </h2>
                <div className="mt-3 flex items-center justify-between gap-3 border-b border-[#2D3739] pb-3">
                  <div className="flex min-w-0 items-center gap-2">
                    {profile.activityType === 'Cycle' ? (
                      <Bike className="h-5 w-5 text-[#70FF00]" aria-hidden="true" />
                    ) : (
                      <Footprints
                        className="h-5 w-5 text-[#70FF00]"
                        aria-hidden="true"
                      />
                    )}
                    <p className="truncate text-xs font-bold text-[#BACBC9]">
                      {profile.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Network size={14} className="text-[#78ABCC]" aria-hidden="true" />
                    <p className="text-xs font-bold text-[#BACBC9]">
                      Times used {profile.timesUsed}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-3">
                  <MapPinned
                    size={18}
                    className="mt-0.5 shrink-0 text-[#BACBC9]"
                    aria-hidden="true"
                  />
                  <div className="space-y-1 text-sm font-bold text-[#BACBC9]">
                    <p>
                      Activity:{' '}
                      <span className="text-[#BACBC9]/80">
                        {profile.activityType}
                      </span>
                    </p>
                    <p>
                      Duration:{' '}
                      <span className="text-[#BACBC9]/80">
                        {profile.preferences.sessionDuration}
                      </span>
                    </p>
                    <p>
                      Terrain:{' '}
                      <span className="text-[#BACBC9]/80">
                        {profile.preferences.mapStyle}
                      </span>
                    </p>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-2 gap-3">
                <PressableButton
                  onClick={() => {
                    if (currentProfile?.id === profile.id) return
                    activateProfile(profile.id)
                    showSuccessToast(
                      'Profile activated',
                      `${profile.name} is now current.`,
                    )
                  }}
                  className="rounded-[4px] border-0"
                  style={{
                    height: 40,
                    borderRadius: 4,
                    backgroundColor:
                      currentProfile?.id === profile.id ? '#84BCA4' : '#BACBC9',
                    color: '#0F1918',
                    fontWeight: 700,
                  }}
                >
                  {currentProfile?.id === profile.id
                    ? 'Current profile'
                    : 'Select profile'}
                </PressableButton>
                <PressableButton
                  onClick={() => {
                    showSuccessToast('Map', 'Open a saved session to view the map.')
                  }}
                  className="rounded-[4px] border-0"
                  style={{
                    height: 40,
                    borderRadius: 4,
                    backgroundColor: '#BACBC9',
                    color: '#0F1918',
                    fontWeight: 700,
                  }}
                >
                  View map
                </PressableButton>
              </div>
              <PressableButton
                onClick={() => {
                  deleteProfile(profile.id)
                  setProfileIndex((value) => Math.max(0, value - 1))
                }}
                className="rounded-[4px] border-0"
                style={{
                  height: 40,
                  borderRadius: 4,
                  backgroundColor: '#3B0000',
                  color: '#FF3B30',
                  fontWeight: 700,
                }}
              >
                Delete profile
              </PressableButton>
            </div>
          ) : null}

          {savedProfiles.length > 0 ? (
            <CarouselControls
              count={savedProfiles.length}
              index={profileIndex}
              onChange={setProfileIndex}
            />
          ) : null}
        </>
      )}

      {activeSession && mapOpen ? (
        <ViewMapModal
          open={mapOpen}
          session={activeSession}
          onClose={() => setMapOpen(false)}
        />
      ) : null}
      </div>
      <BottomNav />
    </div>
  )
}

const EmptyCard = ({ title, body }: { title: string; body: string }) => (
  <section className="flex gap-3 rounded-[4px] bg-[#182629] p-4">
    <div className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-[#4C8DFF]/25 text-[#4C8DFF]">
      <Info size={20} aria-hidden="true" />
    </div>
    <div>
      <p className="font-sans text-base font-bold leading-5 tracking-[-0.01em] text-[#BACBC9]">
        {title}
      </p>
      <p className="mt-1 font-sans text-sm leading-5 tracking-[-0.01em] text-[#BACBC9]/80">
        {body}
      </p>
    </div>
  </section>
)

const SavedTabSwitcher = ({
  active,
  onChange,
}: {
  active: 'sessions' | 'profiles'
  onChange: (tab: 'sessions' | 'profiles') => void
}) => (
  <div className="mx-auto flex w-full max-w-[280px] rounded-full bg-[#BACBC9] p-1">
    {([
      { id: 'sessions', label: 'Sessions' },
      { id: 'profiles', label: 'Profiles' },
    ] as const).map((tab) => {
      const isActive = active === tab.id
      return (
        <button
          key={tab.id}
          type="button"
          aria-label={tab.label}
          aria-pressed={isActive}
          onClick={() => onChange(tab.id)}
          className={`flex-1 rounded-full px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-[-0.01em] transition-colors ${
            isActive
              ? 'bg-[#182629] text-[#BACBC9]'
              : 'bg-transparent text-[#0F1918]'
          }`}
        >
          {tab.label}
        </button>
      )
    })}
  </div>
)

const CarouselControls = ({
  count,
  index,
  onChange,
}: {
  count: number
  index: number
  onChange: (index: number) => void
}) => (
  <div className="flex items-center justify-center gap-4 pb-1">
    <button
      type="button"
      aria-label="Previous"
      disabled={index === 0}
      onClick={() => onChange(Math.max(0, index - 1))}
      className="text-[#BACBC9] disabled:opacity-30"
    >
      <ChevronLeft size={22} />
    </button>
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={
            i === index
              ? 'h-2.5 w-10 rounded-full bg-[#BACBC9]'
              : 'size-2.5 rounded-full bg-[#BACBC9]/40'
          }
          aria-hidden="true"
        />
      ))}
    </div>
    <button
      type="button"
      aria-label="Next"
      disabled={index >= count - 1}
      onClick={() => onChange(Math.min(count - 1, index + 1))}
      className="text-[#BACBC9] disabled:opacity-30"
    >
      <ChevronRight size={22} />
    </button>
  </div>
)
