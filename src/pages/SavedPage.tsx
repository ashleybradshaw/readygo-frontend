import {
  Bike,
  ChevronLeft,
  ChevronRight,
  Info,
  List,
  Network,
  PersonStanding,
  Cloud,
  Clock3,
  MapPinned,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { PaginationDots } from '../components/ui/PaginationDots'
import { ViewMapModal } from '../components/session/ViewMapModal'
import { SettingsCloseButton } from '../components/settings/SettingsCloseButton'
import { buildReviewSummary } from '../lib/onboarding'
import { formatDuration, formatWeatherLine } from '../lib/session'
import { useReadyGoStore } from '../store/useReadyGoStore'
import { showSuccessToast } from '../components/overlays/NotificationHost'

export function SavedPage() {
  const navigate = useNavigate()
  const savedTab = useReadyGoStore((state) => state.savedTab)
  const setSavedTab = useReadyGoStore((state) => state.setSavedTab)
  const savedRoutes = useReadyGoStore((state) => state.savedRoutes)
  const savedProfiles = useReadyGoStore((state) => state.savedProfiles)
  const currentProfile = useReadyGoStore((state) => state.currentProfile)
  const weather = useReadyGoStore((state) => state.weather)
  const activateProfile = useReadyGoStore((state) => state.activateProfile)
  const deleteProfile = useReadyGoStore((state) => state.deleteProfile)
  const startEditProfile = useReadyGoStore((state) => state.startEditProfile)
  const deleteSavedRoute = useReadyGoStore((state) => state.deleteSavedRoute)
  const loadSavedRoute = useReadyGoStore((state) => state.loadSavedRoute)
  const activeSession = useReadyGoStore((state) => state.activeSession)

  const [profileIndex, setProfileIndex] = useState(0)
  const [sessionIndex, setSessionIndex] = useState(0)
  const [mapOpen, setMapOpen] = useState(false)

  const profile = savedProfiles[profileIndex]
  const session = savedRoutes[sessionIndex]

  const profileSummary = useMemo(() => {
    if (!profile) return []
    return buildReviewSummary({
      activityType: profile.activityType,
      locationMode: profile.preferences.locationMode,
      postcode: profile.preferences.postcode,
      preferredTimes: profile.preferences.preferredTimes,
      fitnessLevel: profile.preferences.fitnessLevel,
      weatherChoices: profile.preferences.weatherChoices,
      clothingSuggestions: profile.preferences.clothingSuggestions,
      mapStyle: profile.preferences.mapStyle,
      sessionDuration: profile.preferences.sessionDuration,
    })
  }, [profile])

  const isSessions = savedTab === 'sessions'

  return (
    <div className="flex h-full flex-col gap-4 pt-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase leading-8 tracking-[-0.02em] text-[#0F1918]">
            {isSessions ? 'Saved Sessions' : 'Saved Profiles'}
          </h1>
          <p className="mt-1 font-sans text-sm font-bold uppercase tracking-[-0.01em] text-[#0F1918]">
            {isSessions
              ? `[${savedRoutes.length}]/20 – Saved Routes.`
              : `[${savedProfiles.length}]/5 – Saved Profiles.`}
          </p>
        </div>
        <SettingsCloseButton onClick={() => navigate('/')} />
      </div>

      {isSessions ? (
        <>
          {savedRoutes.length === 0 ? (
            <EmptyCard
              title="Nothing Here Yet."
              body="Complete a Session and save it – it'll live here for next time."
            />
          ) : session ? (
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
              <section className="overflow-hidden rounded-[12px] bg-[#182629]">
                <div className="flex items-center gap-3 border-b border-[#365466] px-4 py-3">
                  <Cloud size={16} className="text-[#BACBC9]" />
                  <p className="text-sm font-bold text-[#BACBC9]">
                    {formatWeatherLine(weather)}
                  </p>
                </div>
                <div className="flex items-center gap-3 border-b border-[#365466] px-4 py-3">
                  <Clock3 size={16} className="text-[#BACBC9]" />
                  <p className="text-sm font-bold text-[#BACBC9]">
                    [{formatDuration(session.durationMinutes)}]
                  </p>
                </div>
                <div className="space-y-1 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <MapPinned size={16} className="mt-0.5 text-[#BACBC9]" />
                    <div className="text-sm font-bold text-[#BACBC9]">
                      <p className="mb-1 text-base">{session.name}</p>
                      <p>
                        Distance:{' '}
                        <span className="text-[#829695]">
                          [{session.distanceKm}]km ([{session.distanceMiles}] miles)
                        </span>
                      </p>
                      <p>
                        Difficulty:{' '}
                        <span className="text-[#829695]">[{session.difficulty}]</span>
                      </p>
                      <p>
                        Start/Finish:{' '}
                        <span className="text-[#829695]">
                          [{session.startLocation || weather.location}] to [
                          {session.endLocation || weather.location}]
                        </span>
                      </p>
                      <p>
                        Terrain:{' '}
                        <span className="text-[#829695]">[{session.terrain}]</span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-2 gap-3">
                <PressableButton
                  className="bg-[#7CFF00]/85 text-rg-text-on-accent"
                  onClick={() => {
                    const loaded = loadSavedRoute(session.id)
                    if (loaded) navigate('/session/go')
                  }}
                >
                  Load session
                </PressableButton>
                <PressableButton
                  className="bg-[#182629] text-[#BACBC9]"
                  onClick={() => {
                    loadSavedRoute(session.id)
                    setMapOpen(true)
                  }}
                >
                  View map
                </PressableButton>
              </div>
              <PressableButton
                className="bg-[#2D191C] text-[#BC757D] hover:bg-[#3A1E22]"
                onClick={() => {
                  deleteSavedRoute(session.id)
                  setSessionIndex((value) => Math.max(0, value - 1))
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
              <section className="rounded-[12px] bg-[#182629] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentProfile?.id === profile.id) return
                      activateProfile(profile.id)
                      showSuccessToast(
                        'Profile activated',
                        `${profile.name} is now current.`,
                      )
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      currentProfile?.id === profile.id
                        ? 'bg-[#7CFF00]/20 text-[#7CFF00]'
                        : 'bg-rg-amber/20 text-rg-amber'
                    }`}
                  >
                    {currentProfile?.id === profile.id
                      ? 'Current profile'
                      : 'Activate profile'}
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-md bg-[#0F1918] text-[#7CFF00]">
                      {profile.activityType === 'Cycle' ? (
                        <Bike size={16} />
                      ) : (
                        <PersonStanding size={16} />
                      )}
                    </span>
                    <p className="text-sm font-bold text-[#BACBC9]">
                      {profile.name}
                    </p>
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 rounded-[10px] bg-[#0F1918] px-3 py-2">
                    <Network size={14} className="text-[#829695]" />
                    <div>
                      <p className="text-[10px] font-bold text-[#829695]">
                        Times used
                      </p>
                      <p className="text-sm font-bold text-[#BACBC9]">
                        {profile.timesUsed}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-[10px] bg-[#0F1918] px-3 py-2">
                    <List size={14} className="text-[#829695]" />
                    <div>
                      <p className="text-[10px] font-bold text-[#829695]">
                        Saved routes
                      </p>
                      <p className="text-sm font-bold text-[#BACBC9]">
                        {
                          savedRoutes.filter(
                            (route) => route.activityType === profile.activityType,
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {profileSummary.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="rounded-[10px] bg-[#0F1918] px-3 py-3 text-sm font-bold capitalize tracking-[-0.5px] text-[#DCE4E6]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-2 gap-3">
                <PressableButton
                  className="bg-[#2D191C] text-[#BC757D] hover:bg-[#3A1E22]"
                  onClick={() => {
                    deleteProfile(profile.id)
                    setProfileIndex((value) => Math.max(0, value - 1))
                  }}
                >
                  Delete profile
                </PressableButton>
                <PressableButton
                  className="bg-[#182629] text-[#BACBC9]"
                  onClick={() => {
                    startEditProfile(profile.id)
                    navigate('/setup')
                  }}
                >
                  Edit profile
                </PressableButton>
              </div>
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

      <SavedTabSwitcher
        active={savedTab}
        onChange={setSavedTab}
      />

      {activeSession && mapOpen ? (
        <ViewMapModal
          open={mapOpen}
          session={activeSession}
          onClose={() => setMapOpen(false)}
        />
      ) : null}
    </div>
  )
}

const EmptyCard = ({ title, body }: { title: string; body: string }) => (
  <section className="flex gap-3 rounded-[12px] bg-[#182629] p-4">
    <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#4C8DFF]/25 text-[#4C8DFF]">
      <Info size={24} aria-hidden="true" />
    </div>
    <div>
      <p className="font-sans text-base font-bold leading-5 tracking-[-0.01em] text-[#BACBC9]">
        {title}
      </p>
      <p className="mt-1 font-sans text-sm leading-5 tracking-[-0.01em] text-[#BACBC9]">
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
  <div className="mx-auto flex w-full max-w-[280px] rounded-full bg-[#F4F8F7] p-1">
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
              : 'bg-transparent text-[#182629]'
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
      className="text-[#182629] disabled:opacity-30"
    >
      <ChevronLeft size={22} />
    </button>
    <PaginationDots count={count} activeIndex={index} />
    <button
      type="button"
      aria-label="Next"
      disabled={index >= count - 1}
      onClick={() => onChange(Math.min(count - 1, index + 1))}
      className="text-[#182629] disabled:opacity-30"
    >
      <ChevronRight size={22} />
    </button>
  </div>
)
