import { AnimatePresence, motion } from 'framer-motion'
import { Bike, PersonStanding } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { ToggleSwitch } from '../components/ui/ToggleSwitch'
import { SettingsCloseButton } from '../components/settings/SettingsCloseButton'
import { formatWeatherLine, buildSessionManifest } from '../lib/session'
import { useReadyGoStore } from '../store/useReadyGoStore'
import activityCycle from '../assets/guest/activity-cycle.png'
import activityRun from '../assets/guest/activity-run.png'

const CYCLE_TERRAINS = ['Paved', 'Rolling', 'Climbs', 'Off Road'] as const
const RUN_TERRAINS = ['Flat', 'Trail', 'Hills', 'Mixed'] as const

const CYCLE_DURATIONS = [
  { label: '1 Hour', hours: 1 },
  { label: '2 Hours', hours: 2 },
  { label: '3 Hours', hours: 3 },
  { label: '4 Hours', hours: 4 },
] as const

const RUN_DURATIONS = [
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
  const [exitOpen, setExitOpen] = useState(false)

  const minMiles = 1
  const maxMiles = isCycle ? 60 : 20
  const terrains = isCycle ? CYCLE_TERRAINS : RUN_TERRAINS
  const durations = isCycle ? CYCLE_DURATIONS : RUN_DURATIONS

  const distanceMiles = Math.min(
    maxMiles,
    Math.max(minMiles, guestSession.distanceMiles),
  )

  const terrainIndex = Math.max(
    0,
    terrains.findIndex((item) => item === guestSession.terrain),
  )
  const durationIndex = Math.max(
    0,
    durations.findIndex((item) => item.label === guestSession.durationLabel),
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
      durationHours: nextType === 'Cycle' ? 1 : 0.5,
      durationLabel: nextType === 'Cycle' ? '1 Hour' : '20/30 Mins',
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

  const handleConfirmExit = () => {
    exitGuestMode()
    setExitOpen(false)
    navigate('/welcome', { replace: true })
  }

  const distanceProgress =
    ((distanceMiles - minMiles) / (maxMiles - minMiles)) * 100
  const terrainProgress =
    terrains.length > 1 ? (terrainIndex / (terrains.length - 1)) * 100 : 0
  const durationProgress =
    durations.length > 1 ? (durationIndex / (durations.length - 1)) * 100 : 0

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
            <SettingsCloseButton
              variant="onDark"
              onClick={() => setExitOpen(true)}
            />
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
              <PersonStanding size={18} aria-hidden="true" />
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
              <Bike size={18} aria-hidden="true" />
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
              <span className="rounded-full bg-[#182629] px-3 py-1.5 text-xs font-bold text-[#BACBC9]">
                1 Min
              </span>
              <span className="rounded-full bg-[#70FF00] px-3 py-1.5 text-xs font-bold text-[#0F191B]">
                [{distanceMiles} Miles]
              </span>
              <span className="rounded-full bg-[#182629] px-3 py-1.5 text-xs font-bold text-[#BACBC9]">
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
            <input
              type="range"
              min={0}
              max={terrains.length - 1}
              step={1}
              value={terrainIndex}
              onChange={(event) => {
                const next = terrains[Number(event.target.value)]
                if (next) setGuestSession({ terrain: next })
              }}
              aria-label="Terrain"
              className="guest-param-slider mt-4 w-full"
              style={{ ['--guest-progress' as string]: `${terrainProgress}%` }}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {terrains.map((terrain) => {
                const active = guestSession.terrain === terrain
                return (
                  <button
                    key={terrain}
                    type="button"
                    tabIndex={0}
                    aria-pressed={active}
                    onClick={() => setGuestSession({ terrain })}
                    className={`h-8 rounded-full border px-3 text-xs font-bold tracking-[-0.01em] ${
                      active
                        ? 'border-[#70FF00] bg-[#182629] text-[#70FF00]'
                        : 'border-transparent bg-[#182629] text-[#BACBC9]'
                    }`}
                  >
                    {terrain}
                  </button>
                )
              })}
            </div>
          </section>

          <section>
            <h2 className="font-display text-base font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
              Estimated Duration
            </h2>
            <p className="mt-1 text-sm text-[#BACBC9]/80">
              How much time do you have?
            </p>
            <input
              type="range"
              min={0}
              max={durations.length - 1}
              step={1}
              value={durationIndex}
              onChange={(event) => {
                const next = durations[Number(event.target.value)]
                if (next) {
                  setGuestSession({
                    durationLabel: next.label,
                    durationHours: next.hours,
                  })
                }
              }}
              aria-label="Estimated duration"
              className="guest-param-slider mt-4 w-full"
              style={{ ['--guest-progress' as string]: `${durationProgress}%` }}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {durations.map((option) => {
                const active = guestSession.durationLabel === option.label
                return (
                  <button
                    key={option.label}
                    type="button"
                    tabIndex={0}
                    aria-pressed={active}
                    onClick={() =>
                      setGuestSession({
                        durationLabel: option.label,
                        durationHours: option.hours,
                      })
                    }
                    className={`h-8 rounded-full border px-3 text-xs font-bold tracking-[-0.01em] ${
                      active
                        ? 'border-[#70FF00] bg-[#182629] text-[#70FF00]'
                        : 'border-transparent bg-[#182629] text-[#BACBC9]'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
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

      <AnimatePresence>
        {exitOpen ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="guest-exit-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[80] flex flex-col bg-[#0F1918] px-5 pb-8 pt-[65px]"
          >
            <div className="flex justify-end">
              <SettingsCloseButton
                variant="onDark"
                onClick={() => setExitOpen(false)}
              />
            </div>
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <h2
                id="guest-exit-title"
                className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-[#BACBC9]"
              >
                Exit Setup
              </h2>
              <p className="mt-2 max-w-[280px] font-sans text-base text-[#BACBC9]">
                Leave guest setup and return to the welcome screen?
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <PressableButton
                onClick={handleConfirmExit}
                className="rounded-[4px] border-0"
                style={{
                  height: 52,
                  borderRadius: 4,
                  backgroundColor: '#FF3B30',
                  color: '#0F191B',
                }}
              >
                Exit
              </PressableButton>
              <button
                type="button"
                tabIndex={0}
                onClick={() => setExitOpen(false)}
                className="px-5 py-3 font-sans text-base font-bold text-[#BACBC9] underline underline-offset-2"
              >
                Keep going
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
