import { AnimatePresence, motion } from 'framer-motion'
import { Bike, ChevronLeft, ChevronRight, PersonStanding } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClosePillButton } from '../components/ui/ClosePillButton'
import { PressableButton } from '../components/ui/PressableButton'
import { ToggleSwitch } from '../components/ui/ToggleSwitch'
import { CancelProfileModal } from '../components/onboarding/CancelProfileModal'
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
  const [cancelOpen, setCancelOpen] = useState(false)

  const isCycle = draft.activityType === 'Cycle'
  const terrains = isCycle ? CYCLE_TERRAINS : RUN_TERRAINS
  const minMiles = 1
  const maxMiles = isCycle ? 60 : 20
  const distanceMiles = Math.min(
    maxMiles,
    Math.max(minMiles, guestSession.distanceMiles || (isCycle ? 15 : 5)),
  )
  const terrainIndex = Math.max(
    0,
    terrains.findIndex((item) => item === guestSession.terrain),
  )
  const trainingIndex = Math.max(
    0,
    TRAINING_OPTIONS.findIndex(
      (item) => item === (draft.preferences.preferredTimes[0] ?? 'Afternoon'),
    ),
  )

  const backgroundSrc = useMemo(
    () => (isCycle ? activityCycle : activityRun),
    [isCycle],
  )

  const distanceProgress =
    ((distanceMiles - minMiles) / (maxMiles - minMiles)) * 100
  const trainingProgress =
    TRAINING_OPTIONS.length > 1
      ? (trainingIndex / (TRAINING_OPTIONS.length - 1)) * 100
      : 0
  const terrainProgress =
    terrains.length > 1 ? (terrainIndex / (terrains.length - 1)) * 100 : 0

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
    completeProfileSetup({
      id: editingProfileId ?? crypto.randomUUID(),
      name,
      activityType: draft.activityType,
      timesUsed: 0,
      preferences: {
        ...draft.preferences,
        preferredTimes: [TRAINING_OPTIONS[trainingIndex]],
        sessionDuration:
          distanceMiles <= 5
            ? 'Under an hour'
            : distanceMiles <= 15
              ? 'Under two hours'
              : 'Under three hours',
      },
    })
    navigate('/setup/gathering', { replace: true })
  }

  const handleClose = () => setCancelOpen(true)

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
                    <PersonStanding size={18} aria-hidden="true" />
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

              <section>
                <h2 className="text-center text-lg font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
                  Preferred Training
                </h2>
                <p className="mt-1 text-center text-sm text-[#BACBC9]/80">
                  Choose your best window in your day
                </p>
                <input
                  type="range"
                  min={0}
                  max={TRAINING_OPTIONS.length - 1}
                  step={1}
                  value={trainingIndex}
                  onChange={(event) => {
                    const next = TRAINING_OPTIONS[Number(event.target.value)]
                    updateDraftPreferences({ preferredTimes: [next] })
                  }}
                  aria-label="Preferred training time"
                  className="guest-param-slider mt-4 w-full"
                  style={{
                    ['--guest-progress' as string]: `${trainingProgress}%`,
                  }}
                />
                <div className="mt-3 flex justify-between gap-2">
                  {TRAINING_OPTIONS.map((option, index) => {
                    const active = index === trainingIndex
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          updateDraftPreferences({ preferredTimes: [option] })
                        }
                        className={`h-8 rounded-[4px] px-3 text-xs font-medium ${
                          active
                            ? 'bg-[#70FF00]/15 text-[#70FF00]'
                            : 'bg-[#182629] text-[#BACBC9]'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
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
                  <span className="rounded-[4px] bg-[#182629] px-3 py-1.5 text-xs font-bold text-[#BACBC9]">
                    1 Min
                  </span>
                  <span className="rounded-[4px] bg-[#70FF00]/15 px-3 py-1.5 text-xs font-bold text-[#70FF00]">
                    [{distanceMiles}Miles]
                  </span>
                  <span className="rounded-[4px] bg-[#182629] px-3 py-1.5 text-xs font-bold text-[#BACBC9]">
                    {maxMiles} Max
                  </span>
                </div>
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
                <input
                  type="range"
                  min={0}
                  max={terrains.length - 1}
                  step={1}
                  value={terrainIndex}
                  onChange={(event) =>
                    setGuestSession({
                      terrain: terrains[Number(event.target.value)],
                    })
                  }
                  aria-label="Terrain"
                  className="guest-param-slider mt-4 w-full"
                  style={{
                    ['--guest-progress' as string]: `${terrainProgress}%`,
                  }}
                />
                <div className="mt-3 flex flex-wrap justify-between gap-2">
                  {terrains.map((option, index) => {
                    const active = index === terrainIndex
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setGuestSession({ terrain: option })}
                        className={`h-8 rounded-[4px] px-3 text-xs font-medium ${
                          active
                            ? 'bg-[#70FF00]/15 text-[#70FF00]'
                            : 'bg-[#182629] text-[#BACBC9]'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
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

      <CancelProfileModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => {
          resetProfileDraft()
          setCancelOpen(false)
          navigate('/user/basecamp-setup', { replace: true })
        }}
      />
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
