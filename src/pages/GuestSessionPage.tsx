import { Bike, Footprints } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { SegmentedPillRow } from '../components/ui/SegmentedPillRow'
import { ToggleSwitch } from '../components/ui/ToggleSwitch'
import { ClosePillButton } from '../components/ui/ClosePillButton'
import { formatWeatherLine, buildSessionManifest } from '../lib/session'
import { useReadyGoStore } from '../store/useReadyGoStore'
import activityCycle from '../assets/guest/activity-cycle.png'
import activityRun from '../assets/guest/activity-run.png'

const CYCLE_TERRAINS = ['Paved', 'Rolling', 'Climbs', 'Off Road'] as const
const RUN_TERRAINS = ['Flat', 'Trail', 'Hills', 'Mixed'] as const

const DURATION_OPTIONS = [
  { label: '20/30 Mins', hours: 0.5 },
  { label: '1 Hour', hours: 1 },
  { label: '1.5 Hours', hours: 1.5 },
  { label: '2+ Hours', hours: 2 },
] as const

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
      durationLabel: '20/30 Mins',
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

  const distanceProgress =
    ((distanceMiles - minMiles) / (maxMiles - minMiles)) * 100

  const durationValue =
    DURATION_OPTIONS.find((item) => item.label === guestSession.durationLabel)
      ?.label ?? DURATION_OPTIONS[0].label

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#0F1918]">
      <img
        src={backgroundSrc}
        alt=""
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-[#0F1918]/80" />

      <div className="relative z-10 flex h-full flex-col px-4 pb-6 pt-[max(2rem,env(safe-area-inset-top))]">
        <div className="relative mb-5">
          <div className="px-10 text-center">
            <p className="truncate text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
              {formatWeatherLine(weather)}
            </p>
            <p className="mt-1 text-xs font-bold tracking-[-0.01em] text-[#BACBC9]/80">
              Dry for the next [{weather.temperatureC > 8 ? 3 : 2}] Hrs
            </p>
          </div>
          <div className="absolute right-0 top-0">
            <ClosePillButton onClick={handleExit} />
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-5">
            <button
              type="button"
              tabIndex={0}
              aria-pressed={!isCycle}
              aria-label="Run"
              onClick={() => handleActivityToggle(false)}
              className={`inline-flex items-center gap-1.5 text-sm font-bold tracking-[-0.01em] ${
                isCycle ? 'text-[#BACBC9]' : 'text-[#70FF00]'
              }`}
            >
              <Footprints
                className={`h-5 w-5 ${isCycle ? 'text-[#BACBC9]' : 'text-[#70FF00]'}`}
                aria-hidden="true"
              />
              Run
            </button>
            <button
              type="button"
              tabIndex={0}
              aria-pressed={isCycle}
              aria-label="Cycle"
              onClick={() => handleActivityToggle(true)}
              className={`inline-flex items-center gap-1.5 text-sm font-bold tracking-[-0.01em] ${
                isCycle ? 'text-[#70FF00]' : 'text-[#BACBC9]'
              }`}
            >
              <Bike
                className={`h-5 w-5 ${isCycle ? 'text-[#70FF00]' : 'text-[#BACBC9]'}`}
                aria-hidden="true"
              />
              Cycle
            </button>
          </div>
          <ToggleSwitch
            label="Toggle cycling or running"
            checked={isCycle}
            onChange={handleActivityToggle}
            alwaysOn
          />
        </div>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pb-4">
          <section>
            <h2 className="font-display text-base font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
              Distance
            </h2>
            <p className="mt-1 text-sm text-[#BACBC9]/80">
              How far do you want to go?
            </p>
            <input
              type="range"
              min={minMiles}
              max={maxMiles}
              step={1}
              value={distanceMiles}
              onChange={(event) =>
                setGuestSession({ distanceMiles: Number(event.target.value) })
              }
              aria-label="Distance in miles"
              className="guest-param-slider mt-4 w-full"
              style={{ ['--guest-progress' as string]: `${distanceProgress}%` }}
            />
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="rounded-full bg-[#BACBC9]/10 px-2.5 py-1.5 text-xs font-bold text-[#BACBC9]">
                1 Min
              </span>
              <span className="rounded-full bg-[#70FF00]/10 px-2.5 py-1.5 text-xs font-bold text-[#70FF00]">
                [{distanceMiles} Miles]
              </span>
              <span className="rounded-full bg-[#BACBC9]/10 px-2.5 py-1.5 text-xs font-bold text-[#BACBC9]">
                {maxMiles} Max
              </span>
            </div>
          </section>

          <section>
            <h2 className="font-display text-base font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
              Terrain
            </h2>
            <p className="mt-1 text-sm text-[#BACBC9]/80">
              What style of route suits today?
            </p>
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
          </section>

          <section>
            <h2 className="font-display text-base font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
              Estimated Duration
            </h2>
            <p className="mt-1 text-sm text-[#BACBC9]/80">
              How much time do you have?
            </p>
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
          </section>
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
