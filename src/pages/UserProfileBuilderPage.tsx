import { AnimatePresence, motion } from 'framer-motion'
import { Bike, ChevronLeft, ChevronRight, Footprints } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClosePillButton } from '../components/ui/ClosePillButton'
import { PressableButton } from '../components/ui/PressableButton'
import { SegmentedPillRow } from '../components/ui/SegmentedPillRow'
import { ToggleSwitch } from '../components/ui/ToggleSwitch'
import { formatWeatherLine } from '../lib/session'
import {
  type PreferredTime,
  useReadyGoStore,
} from '../store/useReadyGoStore'
import activityCycle from '../assets/guest/activity-cycle.png'
import activityRun from '../assets/guest/activity-run.png'

const TRAINING_OPTIONS: PreferredTime[] = ['Morning', 'Afternoon', 'Evening']
const CYCLE_TERRAINS = ['Paved', 'Rolling', 'Climbs', 'Off Road'] as const
const RUN_TERRAINS = ['Flat', 'Trail', 'Hills', 'Mixed'] as const

const DURATION_OPTIONS = [
  { label: '20/30 Mins', hours: 0.5 },
  { label: '1 Hour', hours: 1 },
  { label: '1.5 Hours', hours: 1.5 },
  { label: '2+ Hours', hours: 2 },
] as const

export function UserProfileBuilderPage() {
  const navigate = useNavigate()
  const weather = useReadyGoStore((state) => state.weather)
  const draft = useReadyGoStore((state) => state.profileDraft)
  const guestSession = useReadyGoStore((state) => state.guestSession)
  const updateProfileDraft = useReadyGoStore((state) => state.updateProfileDraft)
  const updateDraftPreferences = useReadyGoStore(
    (state) => state.updateDraftPreferences,
  )
  const setGuestSession = useReadyGoStore((state) => state.setGuestSession)
  const completeProfileSetup = useReadyGoStore(
    (state) => state.completeProfileSetup,
  )
  const editingProfileId = useReadyGoStore((state) => state.editingProfileId)
  const resetProfileDraft = useReadyGoStore((state) => state.resetProfileDraft)

  const [step, setStep] = useState<1 | 2>(1)

  const isCycle = draft.activityType === 'Cycle'
  const terrains = isCycle ? CYCLE_TERRAINS : RUN_TERRAINS
  const minMiles = 1
  const maxMiles = isCycle ? 60 : 20
  const distanceMiles = Math.min(
    maxMiles,
    Math.max(minMiles, guestSession.distanceMiles || (isCycle ? 15 : 5)),
  )
  const trainingValue =
    draft.preferences.preferredTimes[0] ?? ('Afternoon' as PreferredTime)

  const backgroundSrc = useMemo(
    () => (isCycle ? activityCycle : activityRun),
    [isCycle],
  )

  const distanceProgress =
    ((distanceMiles - minMiles) / (maxMiles - minMiles)) * 100

  const durationValue =
    DURATION_OPTIONS.find((item) => item.label === guestSession.durationLabel)
      ?.label ?? DURATION_OPTIONS[1].label

  const handleActivityToggle = (toCycle: boolean) => {
    const nextType = toCycle ? 'Cycle' : 'Run'
    updateProfileDraft({ activityType: nextType })
    setGuestSession({
      terrain: nextType === 'Cycle' ? 'Paved' : 'Flat',
      distanceMiles: nextType === 'Cycle' ? 15 : 5,
    })
  }

  const handleSaveProfile = () => {
    const name =
      draft.name.trim() ||
      (isCycle ? 'Cycle Profile One' : 'Run Profile One')
    const durationHours =
      DURATION_OPTIONS.find((item) => item.label === durationValue)?.hours ?? 1
    completeProfileSetup({
      id: editingProfileId ?? crypto.randomUUID(),
      name,
      activityType: draft.activityType,
      timesUsed: 0,
      preferences: {
        ...draft.preferences,
        preferredTimes: [trainingValue],
        sessionDuration:
          durationHours <= 0.5
            ? 'Under an hour'
            : durationHours <= 1.5
              ? 'Under two hours'
              : 'Under three hours',
      },
    })
    navigate('/setup/gathering', { replace: true })
  }

  const handleClose = () => {
    resetProfileDraft()
    navigate('/user/basecamp', { replace: true })
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#0F1918]">
      <img
        src={backgroundSrc}
        alt=""
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-[#0F1918]/80" />

      <div className="relative z-10 flex h-full flex-col px-5 pb-6 pt-[max(2rem,env(safe-area-inset-top))]">
        <div className="relative mb-4">
          <div className="pr-10 text-center">
            <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-[#BACBC9]">
              {step === 1 ? 'Create Profile' : 'Route Preferences'}
            </h1>
            <p className="mt-1 text-sm font-bold text-[#BACBC9]">
              {step === 1
                ? 'Step 1 of 2 · Baseline & Activity'
                : 'Step 2 of 2 · Terrain & Navigation Rules'}
            </p>
            <p className="mt-1 text-xs font-bold text-[#BACBC9]/80">
              {formatWeatherLine(weather)}
            </p>
          </div>
          <div className="absolute right-0 top-0">
            <ClosePillButton onClick={handleClose} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="min-h-0 flex-1 space-y-5 overflow-y-auto pb-4"
            >
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#BACBC9]">
                  Profile Name
                </span>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(event) =>
                    updateProfileDraft({ name: event.target.value })
                  }
                  placeholder="Weekend Long Ride"
                  aria-label="Profile name"
                  className="h-[54px] w-full rounded-[4px] border border-[#2D3739] bg-[#182629]/80 px-4 text-base font-bold text-[#BACBC9] outline-none placeholder:text-[#BACBC9]/50"
                />
              </label>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    tabIndex={0}
                    aria-pressed={!isCycle}
                    aria-label="Run"
                    onClick={() => handleActivityToggle(false)}
                    className={`inline-flex items-center gap-1.5 text-sm font-bold ${
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
                    className={`inline-flex items-center gap-1.5 text-sm font-bold ${
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

              <section>
                <h2 className="text-center text-lg font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
                  Preferred Training
                </h2>
                <p className="mt-1 text-center text-sm text-[#BACBC9]/80">
                  Choose your best window in your day
                </p>
                <SegmentedPillRow
                  ariaLabel="Preferred training time"
                  value={trainingValue}
                  options={TRAINING_OPTIONS.map((option) => ({
                    id: option,
                    label: option,
                  }))}
                  onChange={(next) =>
                    updateDraftPreferences({
                      preferredTimes: [next as PreferredTime],
                    })
                  }
                />
              </section>

              <section>
                <h2 className="text-center text-lg font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
                  Distance
                </h2>
                <p className="mt-1 text-center text-sm text-[#BACBC9]/80">
                  How far do you want to go?
                </p>
                <input
                  type="range"
                  min={minMiles}
                  max={maxMiles}
                  step={1}
                  value={distanceMiles}
                  onChange={(event) =>
                    setGuestSession({
                      distanceMiles: Number(event.target.value),
                    })
                  }
                  aria-label="Distance in miles"
                  className="guest-param-slider mt-4 w-full"
                  style={{
                    ['--guest-progress' as string]: `${distanceProgress}%`,
                  }}
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
                <h2 className="text-center text-lg font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
                  Estimated Duration
                </h2>
                <p className="mt-1 text-center text-sm text-[#BACBC9]/80">
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
                    const next = DURATION_OPTIONS.find(
                      (item) => item.label === label,
                    )
                    if (!next) return
                    setGuestSession({
                      durationLabel: next.label,
                      durationHours: next.hours,
                    })
                  }}
                />
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="min-h-0 flex-1 space-y-5 overflow-y-auto pb-4"
            >
              <section>
                <h2 className="text-center text-lg font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
                  Terrain
                </h2>
                <p className="mt-1 text-center text-sm text-[#BACBC9]/80">
                  What style of route suits today?
                </p>
                <SegmentedPillRow
                  ariaLabel="Terrain"
                  value={
                    (terrains as readonly string[]).includes(guestSession.terrain)
                      ? guestSession.terrain
                      : terrains[0]
                  }
                  options={terrains.map((option) => ({
                    id: option,
                    label: option,
                  }))}
                  onChange={(terrain) => setGuestSession({ terrain })}
                />
              </section>

              <ToggleRow
                leftLabel="Loop"
                rightLabel="Point-to-Point"
                checked={draft.preferences.loopOrSingleDestination}
                onChange={(checked) =>
                  updateDraftPreferences({ loopOrSingleDestination: checked })
                }
              />
              <ToggleRow
                leftLabel="Avoid Heavy Traffic"
                checked={draft.preferences.showTraffic}
                onChange={(checked) =>
                  updateDraftPreferences({ showTraffic: checked })
                }
              />
              <ToggleRow
                leftLabel="Prefer Bike Paths"
                checked={draft.preferences.preferBikePaths}
                highlight
                onChange={(checked) =>
                  updateDraftPreferences({ preferBikePaths: checked })
                }
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              tabIndex={0}
              aria-label="Previous step"
              disabled={step === 1}
              onClick={() => setStep(1)}
              className="text-[#BACBC9] disabled:opacity-40"
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <div className="flex items-center gap-2">
              <span
                className={
                  step === 1
                    ? 'h-2.5 w-10 rounded-full bg-[#BACBC9]'
                    : 'size-2.5 rounded-full bg-[#BACBC9]/40'
                }
              />
              <span
                className={
                  step === 2
                    ? 'h-2.5 w-10 rounded-full bg-[#BACBC9]'
                    : 'size-2.5 rounded-full bg-[#BACBC9]/40'
                }
              />
            </div>
            <button
              type="button"
              tabIndex={0}
              aria-label="Next step"
              disabled={step === 2}
              onClick={() => setStep(2)}
              className="text-[#BACBC9] disabled:opacity-40"
            >
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </div>

          <PressableButton
            onClick={() => {
              if (step === 1) {
                setStep(2)
                return
              }
              handleSaveProfile()
            }}
            className="rounded-[4px] border-0"
            style={{
              height: 54,
              borderRadius: 4,
              backgroundColor: '#2D3739',
              color: '#BACBC9',
              fontWeight: 700,
            }}
          >
            {step === 1 ? 'Route Preferences' : 'Save Profile'}
          </PressableButton>
        </div>
      </div>
    </div>
  )
}

const ToggleRow = ({
  leftLabel,
  rightLabel,
  checked,
  onChange,
  highlight = false,
}: {
  leftLabel: string
  rightLabel?: string
  checked: boolean
  onChange: (checked: boolean) => void
  highlight?: boolean
}) => (
  <div className="flex items-center justify-between gap-3 py-1">
    <div className="flex min-w-0 items-center gap-3">
      <span
        className={`text-sm font-bold ${
          rightLabel
            ? checked
              ? 'text-[#BACBC9]'
              : 'text-[#70FF00]'
            : highlight || checked
              ? 'text-[#70FF00]'
              : 'text-[#BACBC9]'
        }`}
      >
        {leftLabel}
      </span>
      {rightLabel ? (
        <span
          className={`text-sm font-bold ${
            checked ? 'text-[#70FF00]' : 'text-[#BACBC9]'
          }`}
        >
          {rightLabel}
        </span>
      ) : null}
    </div>
    <ToggleSwitch
      label={rightLabel ? `${leftLabel} or ${rightLabel}` : leftLabel}
      checked={checked}
      onChange={onChange}
    />
  </div>
)
