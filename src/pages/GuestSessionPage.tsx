import { X } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActivitySelectorBar } from '../components/ui/ActivitySelectorBar'
import { DistanceSlider } from '../components/ui/DistanceSlider'
import { PressableButton } from '../components/ui/PressableButton'
import { SegmentedPillRow } from '../components/ui/SegmentedPillRow'
import { SetupSection } from '../components/ui/SetupSection'
import { formatWeatherLine, buildSessionManifest } from '../lib/session'
import { useReadyGoStore } from '../store/useReadyGoStore'
import activityCycle from '../assets/guest/activity-cycle.png'
import activityRun from '../assets/guest/activity-run.png'

const CYCLE_TERRAINS = ['Paved', 'Rolling', 'Climbs', 'Off Road'] as const
const RUN_TERRAINS = ['Flat', 'Trail', 'Hills', 'Mixed'] as const

const DURATION_OPTIONS = [
  { label: '20-30 Min', hours: 0.5 },
  { label: '1 Hr', hours: 1 },
  { label: '1.5 Hr', hours: 1.5 },
  { label: '2+ Hr', hours: 2 },
] as const

const resolveDurationLabel = (label: string) => {
  if (label === '1 Hour') return '1 Hr'
  if (label === '1.5 Hours') return '1.5 Hr'
  if (label === '2+ Hours') return '2+ Hr'
  if (label === '20/30 Mins') return '20-30 Min'
  return label
}

export function GuestSessionPage() {
  const navigate = useNavigate()
  const weather = useReadyGoStore((state) => state.weather)
  const profileDraft = useReadyGoStore((state) => state.profileDraft)
  const guestSession = useReadyGoStore((state) => state.guestSession)
  const updateProfileDraft = useReadyGoStore((state) => state.updateProfileDraft)
  const setGuestSession = useReadyGoStore((state) => state.setGuestSession)
  const setOneTimeSessionHours = useReadyGoStore(
    (state) => state.setOneTimeSessionHours,
  )
  const setCurrentProfile = useReadyGoStore((state) => state.setCurrentProfile)
  const beginSessionBuild = useReadyGoStore((state) => state.beginSessionBuild)
  const markSessionReady = useReadyGoStore((state) => state.markSessionReady)
  const exitGuestMode = useReadyGoStore((state) => state.exitGuestMode)

  const isCycle = profileDraft.activityType === 'Cycle'

  const minMiles = 1
  const maxMiles = isCycle ? 60 : 20
  const terrains = isCycle ? CYCLE_TERRAINS : RUN_TERRAINS
  const dryHours = weather.temperatureC > 8 ? 3 : 2

  const distanceMiles = Math.min(
    maxMiles,
    Math.max(minMiles, guestSession.distanceMiles),
  )

  useEffect(() => {
    if (!guestSession.activitySelected || !guestSession.locationGranted) {
      navigate('/guest/activity', { replace: true })
    }
  }, [guestSession.activitySelected, guestSession.locationGranted, navigate])

  const backgroundSrc = useMemo(
    () => (isCycle ? activityCycle : activityRun),
    [isCycle],
  )

  const handleActivityToggle = (toCycle: boolean) => {
    const nextType = toCycle ? 'Cycle' : 'Run'
    updateProfileDraft({ activityType: nextType })
    setGuestSession({
      terrain: nextType === 'Cycle' ? 'Paved' : 'Flat',
      durationHours: 0.5,
      durationLabel: '20-30 Min',
      distanceMiles: nextType === 'Cycle' ? 15 : 5,
    })
  }

  const handleReady = () => {
    const guestProfile = {
      id: 'guest-profile',
      name: isCycle ? 'Guest Cycle' : 'Guest Run',
      activityType: profileDraft.activityType,
      timesUsed: 0,
      preferences: {
        ...profileDraft.preferences,
        locationMode: 'gps' as const,
        usePhoneLocation: true,
      },
    }

    setCurrentProfile(guestProfile)
    setOneTimeSessionHours(guestSession.durationHours)

    const session = buildSessionManifest({
      profile: guestProfile,
      weather,
      hours: guestSession.durationHours,
      distanceMiles,
      terrain: guestSession.terrain,
    })

    beginSessionBuild(session)
    markSessionReady()
    navigate('/guest/session-ready', { replace: true })
  }

  const handleExit = () => {
    exitGuestMode()
    navigate('/welcome', { replace: true })
  }

  const durationValue =
    DURATION_OPTIONS.find(
      (item) => item.label === resolveDurationLabel(guestSession.durationLabel),
    )?.label ?? DURATION_OPTIONS[0].label

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#0F1918]">
      <img
        src={backgroundSrc}
        alt=""
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-[#0F1918]/80" />

      <button
        type="button"
        tabIndex={0}
        aria-label="Close"
        onClick={handleExit}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleExit()
          }
        }}
        className="absolute top-4 right-4 z-20 cursor-pointer text-[#BACBC9]/60 hover:text-white"
      >
        <X className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
      </button>

      <div className="relative z-10 flex h-full flex-col px-4 pb-6 pt-[max(2rem,env(safe-area-inset-top))]">
        <div className="mb-4 text-left">
          <h2 className="text-2xl font-black tracking-wide text-white uppercase">
            Guest Profile
          </h2>
          <p className="mt-1 truncate text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
            {formatWeatherLine(weather)}
          </p>
          <p className="mt-1 text-xs font-bold tracking-[-0.01em] text-[#BACBC9]/80">
            Dry for the next [{dryHours}] Hrs
          </p>
        </div>

        <ActivitySelectorBar
          isCycle={isCycle}
          onChange={handleActivityToggle}
        />

        <div className="min-h-0 flex-1 overflow-y-auto pb-4">
          <DistanceSlider
            maxMiles={maxMiles}
            value={distanceMiles}
            onChange={(miles) => setGuestSession({ distanceMiles: miles })}
          />

          <SetupSection
            title="Estimated Duration"
            subtitle="How much time do you have?"
          >
            <SegmentedPillRow
              ariaLabel="Estimated duration"
              value={durationValue}
              options={DURATION_OPTIONS.map((option) => ({
                id: option.label,
                label: option.label,
              }))}
              onChange={(label) => {
                const next = DURATION_OPTIONS.find((item) => item.label === label)
                if (!next) return
                setGuestSession({
                  durationLabel: next.label,
                  durationHours: next.hours,
                })
              }}
            />
          </SetupSection>

          <SetupSection
            title="Terrain"
            subtitle="What style of route suits you?"
          >
            <SegmentedPillRow
              ariaLabel="Terrain"
              value={
                (terrains as readonly string[]).includes(guestSession.terrain)
                  ? guestSession.terrain
                  : terrains[0]
              }
              options={terrains.map((terrain) => ({
                id: terrain,
                label: terrain,
              }))}
              onChange={(terrain) => setGuestSession({ terrain })}
            />
          </SetupSection>
        </div>

        <PressableButton
          onClick={handleReady}
          className="rounded-[4px] border-0"
          style={{
            height: 56,
            borderRadius: 4,
            backgroundColor: '#FF3B30',
            color: '#0F191B',
            fontWeight: 700,
          }}
        >
          Ready
        </PressableButton>
      </div>
    </div>
  )
}
