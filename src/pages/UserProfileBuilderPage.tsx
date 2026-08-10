import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActivitySelectorBar } from '../components/ui/ActivitySelectorBar'
import { DistanceSlider } from '../components/ui/DistanceSlider'
import { MultiSelectPillRow } from '../components/ui/MultiSelectPillRow'
import { PressableButton } from '../components/ui/PressableButton'
import { SegmentedPillRow } from '../components/ui/SegmentedPillRow'
import { SetupSection } from '../components/ui/SetupSection'
import { BinaryToggle, BooleanToggle } from '../components/common/Toggle'
import { formatWeatherLine } from '../lib/session'
import {
  type PreferredTime,
  type WeatherChoice,
  useReadyGoStore,
} from '../store/useReadyGoStore'
import activityCycle from '../assets/guest/activity-cycle.png'
import activityRun from '../assets/guest/activity-run.png'

const TRAINING_OPTIONS: PreferredTime[] = ['Morning', 'Afternoon', 'Evening']
const CYCLE_TERRAINS = ['Paved', 'Rolling', 'Climbs', 'Off Road'] as const
const RUN_TERRAINS = ['Flat', 'Trail', 'Hills', 'Mixed'] as const
const PREFERRED_WEATHER: WeatherChoice[] = [
  'Sunshine',
  'Dry',
  'Wet',
  'Rain/Snow',
]

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
  const isAuthenticated = useReadyGoStore((state) => state.isAuthenticated)
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

  const durationValue =
    DURATION_OPTIONS.find(
      (item) => item.label === resolveDurationLabel(guestSession.durationLabel),
    )?.label ?? DURATION_OPTIONS[1].label

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
    if (isAuthenticated) {
      navigate('/user/basecamp', { replace: true })
      return
    }
    navigate('/welcome', { replace: true })
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

      <button
        type="button"
        tabIndex={0}
        aria-label="Close"
        onClick={handleClose}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleClose()
          }
        }}
        className="absolute top-4 right-4 z-20 cursor-pointer text-[#BACBC9]/60 hover:text-white"
      >
        <X className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
      </button>

      <div className="relative z-10 flex h-full flex-col px-5 pb-6 pt-[max(2rem,env(safe-area-inset-top))]">
        <div className="mb-4 text-left">
          <h1 className="text-2xl font-black tracking-wide text-white uppercase">
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

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="min-h-0 flex-1 overflow-y-auto pb-4"
            >
              <ActivitySelectorBar
                isCycle={isCycle}
                onChange={handleActivityToggle}
              />

              <label className="mb-[10px] block">
                <input
                  type="text"
                  value={draft.name}
                  onChange={(event) =>
                    updateProfileDraft({ name: event.target.value })
                  }
                  placeholder="Name your profile."
                  aria-label="Profile name"
                  className="h-[54px] w-full rounded-[4px] border border-[#2D3739] bg-[#182629]/80 px-4 text-base font-bold text-[#BACBC9] outline-none placeholder:text-[#BACBC9]/50"
                />
              </label>

              <SetupSection
                title="Preferred Training"
                subtitle="Choose your best window in your day"
              >
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
              </SetupSection>

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
              </SetupSection>
            </motion.div>
          ) : (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="min-h-0 flex-1 overflow-y-auto pb-4"
            >
              <SetupSection
                title="Terrain"
                subtitle="What style of route suits today?"
              >
                <SegmentedPillRow
                  ariaLabel="Terrain"
                  value={
                    (terrains as readonly string[]).includes(
                      guestSession.terrain,
                    )
                      ? guestSession.terrain
                      : terrains[0]
                  }
                  options={terrains.map((option) => ({
                    id: option,
                    label: option,
                  }))}
                  onChange={(terrain) => setGuestSession({ terrain })}
                />
              </SetupSection>

              <SetupSection
                title="Preferred Weather"
                subtitle="Select as many as you like."
              >
                <MultiSelectPillRow
                  ariaLabel="Preferred weather"
                  values={draft.preferences.weatherChoices}
                  options={PREFERRED_WEATHER.map((option) => ({
                    id: option,
                    label: option,
                  }))}
                  onChange={(next) =>
                    updateDraftPreferences({
                      weatherChoices: next as WeatherChoice[],
                    })
                  }
                />
              </SetupSection>

              <div className="mb-[10px] w-full rounded-[4px] border border-[#2D3739]/60 bg-[#182629]/40 p-4">
                <div className="flex w-full flex-col gap-[14px] py-1">
                  <ToggleRow
                    leftLabel="Loop"
                    rightLabel="Point-to-Point"
                    checked={draft.preferences.loopOrSingleDestination}
                    onChange={(checked) =>
                      updateDraftPreferences({
                        loopOrSingleDestination: checked,
                      })
                    }
                  />

                  {isCycle ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <ToggleRow
                        leftLabel="Parks"
                        checked={draft.preferences.preferParks}
                        highlight
                        onChange={(checked) =>
                          updateDraftPreferences({ preferParks: checked })
                        }
                      />
                      <ToggleRow
                        leftLabel="Trails"
                        checked={draft.preferences.preferTrails}
                        onChange={(checked) =>
                          updateDraftPreferences({ preferTrails: checked })
                        }
                      />
                    </>
                  )}
                </div>
              </div>
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
  binary = false,
}: {
  leftLabel: string
  rightLabel?: string
  checked: boolean
  onChange: (checked: boolean) => void
  highlight?: boolean
  binary?: boolean
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
    {binary || rightLabel ? (
      <BinaryToggle
        label={rightLabel ? `${leftLabel} or ${rightLabel}` : leftLabel}
        checked={checked}
        onChange={onChange}
      />
    ) : (
      <BooleanToggle
        label={leftLabel}
        checked={checked}
        onChange={onChange}
      />
    )}
  </div>
)
