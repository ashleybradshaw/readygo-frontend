import { Bike, ChevronLeft, ChevronRight, Info, List, Network, PersonStanding } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { PaginationDots } from '../components/ui/PaginationDots'
import { ViewMapModal } from '../components/session/ViewMapModal'
import { buildReviewSummary } from '../lib/onboarding'
import { formatDuration, formatWeatherLine } from '../lib/session'
import { useReadyGoStore } from '../store/useReadyGoStore'
import { Cloud, Clock3, MapPinned } from 'lucide-react'
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

  return (
    <div className="flex h-full flex-col gap-4 pt-1">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-rg-text">
          {savedTab === 'sessions' ? 'Saved sessions' : 'Saved profiles'}
        </h1>
        <p className="mt-1 text-sm font-bold uppercase text-rg-text-muted">
          {savedTab === 'sessions'
            ? `[${savedRoutes.length}]/20 – saved routes.`
            : `[${savedProfiles.length}]/5 – saved profiles.`}
        </p>
      </div>

      <div className="mx-auto flex w-fit rounded-full bg-rg-surface p-1 outline outline-1 outline-[#365466]">
        {([
          { id: 'sessions', label: 'Sessions' },
          { id: 'profiles', label: 'Profiles' },
        ] as const).map((tab) => {
          const active = savedTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSavedTab(tab.id)}
              className={`rounded-full px-5 py-2 text-xs font-bold uppercase ${
                active
                  ? 'bg-rg-base-alt text-rg-text'
                  : 'text-rg-text-muted'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {savedTab === 'sessions' ? (
        <>
          {savedRoutes.length === 0 ? (
            <EmptyCard
              title="Nothing here yet."
              body="Complete a session and save it – it'll live here for next time."
            />
          ) : session ? (
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
              <section className="overflow-hidden rounded-[12px] outline outline-1 outline-[#365466]">
                <div className="flex items-center gap-3 border-b border-[#365466] bg-rg-surface px-4 py-3">
                  <Cloud size={16} />
                  <p className="text-sm font-bold text-rg-text-muted">
                    {formatWeatherLine(weather)}
                  </p>
                </div>
                <div className="flex items-center gap-3 border-b border-[#365466] bg-rg-surface px-4 py-3">
                  <Clock3 size={16} />
                  <p className="text-sm font-bold text-rg-text">
                    [{formatDuration(session.durationMinutes)}]
                  </p>
                </div>
                <div className="space-y-1 bg-rg-surface px-4 py-3">
                  <div className="flex items-start gap-3">
                    <MapPinned size={16} className="mt-0.5" />
                    <div className="text-sm font-bold text-rg-text">
                      <p className="mb-1 text-base">{session.name}</p>
                      <p>
                        Distance:{' '}
                        <span className="text-rg-text-muted">
                          [{session.distanceKm}]km ([{session.distanceMiles}] miles)
                        </span>
                      </p>
                      <p>
                        Difficulty:{' '}
                        <span className="text-rg-text-muted">[{session.difficulty}]</span>
                      </p>
                      <p>
                        Start/Finish:{' '}
                        <span className="text-rg-text-muted">
                          [{session.startLocation || weather.location}] to [
                          {session.endLocation || weather.location}]
                        </span>
                      </p>
                      <p>
                        Terrain:{' '}
                        <span className="text-rg-text-muted">[{session.terrain}]</span>
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
                    if (loaded) navigate('/session')
                  }}
                >
                  Load session
                </PressableButton>
                <PressableButton
                  onClick={() => {
                    loadSavedRoute(session.id)
                    setMapOpen(true)
                  }}
                >
                  View map
                </PressableButton>
              </div>
              <PressableButton
                className="bg-[#3A1E22] text-[#FF8A80] hover:bg-[#4A252A]"
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
              title="No profiles saved yet."
              body="Head to setup to build your first profile."
            />
          ) : profile ? (
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
              <section className="rounded-[12px] bg-rg-surface p-4 outline outline-1 outline-[#365466]">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentProfile?.id === profile.id) return
                      activateProfile(profile.id)
                      showSuccessToast('Profile activated', `${profile.name} is now current.`)
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
                    <span className="flex size-8 items-center justify-center rounded-md bg-rg-base-alt text-[#7CFF00]">
                      {profile.activityType === 'Cycle' ? (
                        <Bike size={16} />
                      ) : (
                        <PersonStanding size={16} />
                      )}
                    </span>
                    <p className="text-sm font-bold text-rg-text">{profile.name}</p>
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 rounded-[10px] bg-rg-base-alt px-3 py-2">
                    <Network size={14} className="text-rg-text-muted" />
                    <div>
                      <p className="text-[10px] font-bold text-rg-text-muted">Times used</p>
                      <p className="text-sm font-bold">{profile.timesUsed}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-[10px] bg-rg-base-alt px-3 py-2">
                    <List size={14} className="text-rg-text-muted" />
                    <div>
                      <p className="text-[10px] font-bold text-rg-text-muted">Saved routes</p>
                      <p className="text-sm font-bold">
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
                      className="rounded-[10px] bg-rg-base-alt px-3 py-3 text-sm font-bold capitalize tracking-[-0.5px] text-[#DCE4E6]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-2 gap-3">
                <PressableButton
                  className="bg-[#3A1E22] text-[#FF8A80] hover:bg-[#4A252A]"
                  onClick={() => {
                    deleteProfile(profile.id)
                    setProfileIndex((value) => Math.max(0, value - 1))
                  }}
                >
                  Delete profile
                </PressableButton>
                <PressableButton
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

function EmptyCard({ title, body }: { title: string; body: string }) {
  return (
    <section className="flex gap-3 rounded-[12px] bg-[#132033] p-4 outline outline-1 outline-[#2C4A66]">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#4C8DFF]/20 text-[#4C8DFF]">
        <Info size={14} />
      </div>
      <div>
        <p className="text-sm font-bold text-[#8EB7FF]">{title}</p>
        <p className="mt-1 text-sm text-rg-text-muted">{body}</p>
      </div>
    </section>
  )
}

function CarouselControls({
  count,
  index,
  onChange,
}: {
  count: number
  index: number
  onChange: (index: number) => void
}) {
  return (
    <div className="flex items-center justify-center gap-4 pb-1">
      <button
        type="button"
        aria-label="Previous"
        disabled={index === 0}
        onClick={() => onChange(Math.max(0, index - 1))}
        className="text-rg-text-muted disabled:opacity-30"
      >
        <ChevronLeft size={22} />
      </button>
      <PaginationDots count={count} activeIndex={index} />
      <button
        type="button"
        aria-label="Next"
        disabled={index >= count - 1}
        onClick={() => onChange(Math.min(count - 1, index + 1))}
        className="text-[#7CFF00] disabled:opacity-30"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  )
}
