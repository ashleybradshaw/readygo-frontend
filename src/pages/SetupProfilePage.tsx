import {
  Bike,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Map,
  PersonStanding,
  Shirt,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { PaginationDots } from '../components/ui/PaginationDots'
import { ProgressBar } from '../components/ui/ProgressBar'
import { SegmentedOptions } from '../components/ui/SegmentedOptions'
import { ToggleSwitch } from '../components/ui/ToggleSwitch'
import { TextField } from '../components/ui/TextField'
import {
  type FitnessLevel,
  type MapStyle,
  type PreferredTime,
  type WeatherChoice,
  useReadyGoStore,
} from '../store/useReadyGoStore'

const STEPS = [
  'location',
  'times',
  'fitness',
  'weather',
  'clothing',
  'maps',
] as const

type StepId = (typeof STEPS)[number]

export function SetupProfilePage() {
  const navigate = useNavigate()
  const userName = useReadyGoStore((state) => state.userName)
  const draft = useReadyGoStore((state) => state.profileDraft)
  const updateProfileDraft = useReadyGoStore((state) => state.updateProfileDraft)
  const updateDraftPreferences = useReadyGoStore(
    (state) => state.updateDraftPreferences,
  )

  const [stepIndex, setStepIndex] = useState(0)
  const step = STEPS[stepIndex]
  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100)

  const greeting = useMemo(
    () => `Hello, ${userName || 'there'}`,
    [userName],
  )

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((value) => value + 1)
      return
    }
    navigate('/setup/review')
  }

  const goPrev = () => {
    if (stepIndex === 0) {
      navigate('/')
      return
    }
    setStepIndex((value) => value - 1)
  }

  return (
    <div className="flex h-full flex-col bg-rg-base-alt px-5 pb-6 pt-10">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-rg-text-muted">
            {greeting}
          </h1>
          <p className="mt-1 text-base font-bold uppercase tracking-[-0.01em] text-rg-text-muted">
            Setting up · {progress}% complete
          </p>
          <div className="mt-3">
            <ProgressBar value={progress} />
          </div>
        </div>
        <button
          type="button"
          aria-label="Close setup"
          onClick={() => navigate('/')}
          className="rounded-full bg-rg-surface p-2.5 text-rg-text-muted"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-[12px] bg-rg-surface px-4 py-2.5 outline outline-1 outline-[#365466]">
        <div className="flex items-center gap-4">
          <span
            className={`flex items-center gap-1.5 text-sm font-bold ${
              draft.activityType === 'Run'
                ? 'text-[#7CFF00]'
                : 'text-rg-text-dim'
            }`}
          >
            <PersonStanding size={18} />
            Run
          </span>
          <span
            className={`flex items-center gap-1.5 text-sm font-bold ${
              draft.activityType === 'Cycle'
                ? 'text-[#7CFF00]'
                : 'text-rg-text-dim'
            }`}
          >
            <Bike size={18} />
            Cycle
          </span>
        </div>
        <ToggleSwitch
          label="Activity type"
          checked={draft.activityType === 'Cycle'}
          onChange={(checked) =>
            updateProfileDraft({ activityType: checked ? 'Cycle' : 'Run' })
          }
        />
      </div>

      <div className="mb-3 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous step"
          onClick={goPrev}
          className="text-rg-text-muted"
        >
          <ChevronLeft size={22} />
        </button>
        <PaginationDots count={STEPS.length} activeIndex={stepIndex} />
        <button
          type="button"
          aria-label="Next step"
          onClick={goNext}
          className="text-rg-text-muted"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
          >
            <StepPanel
              step={step}
              draft={draft}
              updateDraftPreferences={updateDraftPreferences}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4">
        <PressableButton onClick={goNext}>
          {stepIndex === STEPS.length - 1 ? 'Review and Go' : 'Continue'}
        </PressableButton>
      </div>
    </div>
  )
}

function StepPanel({
  step,
  draft,
  updateDraftPreferences,
}: {
  step: StepId
  draft: ReturnType<typeof useReadyGoStore.getState>['profileDraft']
  updateDraftPreferences: (
    partial: Partial<
      ReturnType<typeof useReadyGoStore.getState>['profileDraft']['preferences']
    >,
  ) => void
}) {
  const prefs = draft.preferences

  if (step === 'location') {
    return (
      <section className="overflow-hidden rounded-[12px] bg-rg-surface outline outline-1 outline-[#365466]">
        <div className="flex gap-3 p-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-rg-base-alt text-rg-text">
            <Map size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-rg-text">
              Set location for routes
            </h2>
            <p className="mt-1 text-sm text-rg-text-muted">
              ReadyGo needs a starting point to build your route. Use your
              current GPS, set a home location, or drop a postcode.
            </p>
          </div>
        </div>

        <ToggleRow
          label="Turn on location settings"
          checked={prefs.locationSettingsOn}
          onChange={(checked) =>
            updateDraftPreferences({ locationSettingsOn: checked })
          }
        />
        <ToggleRow
          label="Use phone's location"
          checked={prefs.usePhoneLocation}
          onChange={(checked) =>
            updateDraftPreferences({
              usePhoneLocation: checked,
              locationMode: checked ? 'gps' : prefs.locationMode,
            })
          }
        />
        <ToggleRow
          label="Set current location"
          checked={prefs.setCurrentLocation}
          onChange={(checked) =>
            updateDraftPreferences({
              setCurrentLocation: checked,
              locationMode: checked ? 'home' : prefs.locationMode,
            })
          }
        />
        <div className="border-t border-[#365466] p-3">
          <TextField
            label="Postcode"
            placeholder="Type your post code (Optional)"
            value={prefs.postcode}
            onChange={(event) =>
              updateDraftPreferences({
                postcode: event.target.value,
                locationMode: 'postcode',
              })
            }
          />
        </div>
      </section>
    )
  }

  if (step === 'times') {
    return (
      <StepCard
        icon={<CloudSun size={16} />}
        title="Preferred times"
        body="Morning runner? Evening cyclist? Let us know when you usually head out so your plan fits your day."
      >
        <SegmentedOptions<PreferredTime>
          multiple
          options={[
            { value: 'Morning', label: 'Morning' },
            { value: 'Afternoon', label: 'Afternoon' },
            { value: 'Evening', label: 'Evening' },
          ]}
          value={prefs.preferredTimes}
          onChange={(value) =>
            updateDraftPreferences({
              preferredTimes: value as PreferredTime[],
            })
          }
        />
      </StepCard>
    )
  }

  if (step === 'fitness') {
    return (
      <StepCard
        icon={<PersonStanding size={16} />}
        title="Fitness levels"
        body="GOAI takes your preferences and builds your session – route, duration, effort level – every time you tap Ready."
      >
        <SegmentedOptions<FitnessLevel>
          options={[
            { value: 'Easy', label: 'Easy' },
            { value: 'Steady', label: 'Steady' },
            { value: 'Hard', label: 'Hard' },
            { value: 'Mixed', label: 'Mixed' },
          ]}
          value={prefs.fitnessLevel}
          onChange={(value) =>
            updateDraftPreferences({ fitnessLevel: value as FitnessLevel })
          }
        />
      </StepCard>
    )
  }

  if (step === 'weather') {
    return (
      <StepCard
        icon={<CloudSun size={16} />}
        title="Weather choices"
        body="Tell us what weather you'll head out in. Dry only, or fine with a bit of drizzle? ReadyGo will only suggest sessions that match."
      >
        <SegmentedOptions<WeatherChoice>
          multiple
          options={[
            { value: 'Dry only', label: 'Dry only' },
            { value: 'Light drizzle', label: 'Light drizzle' },
            { value: 'Any weather', label: 'Any weather' },
          ]}
          value={prefs.weatherChoices}
          onChange={(value) =>
            updateDraftPreferences({
              weatherChoices: value as WeatherChoice[],
            })
          }
        />
      </StepCard>
    )
  }

  if (step === 'clothing') {
    return (
      <StepCard
        icon={<Shirt size={16} />}
        title="Clothing suggestions"
        body="ReadyGo can suggest what to wear based on live conditions. Layers, waterproof, base layer – no more standing at the door guessing."
      >
        <div className="flex items-center justify-between rounded-[10px] bg-rg-base-alt px-4 py-3">
          <span className="text-sm font-bold text-rg-text">
            Suggest kit for conditions
          </span>
          <ToggleSwitch
            label="Clothing suggestions"
            checked={prefs.clothingSuggestions}
            onChange={(checked) =>
              updateDraftPreferences({ clothingSuggestions: checked })
            }
          />
        </div>
      </StepCard>
    )
  }

  return (
    <StepCard
      icon={<Map size={16} />}
      title="Map styles"
      body="Choose how your route is displayed – simple minimap, or full navigation mode. Loop routes or point-to-point, your call."
    >
      <SegmentedOptions<MapStyle>
        options={[
          { value: 'Minimap', label: 'Minimap' },
          { value: 'Full navigation', label: 'Full navigation' },
        ]}
        value={prefs.mapStyle}
        onChange={(value) =>
          updateDraftPreferences({ mapStyle: value as MapStyle })
        }
      />
    </StepCard>
  )
}

function StepCard({
  icon,
  title,
  body,
  children,
}: {
  icon: ReactNode
  title: string
  body: string
  children: ReactNode
}) {
  return (
    <section className="rounded-[12px] bg-rg-surface p-4 outline outline-1 outline-[#365466]">
      <div className="mb-4 flex gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-rg-base-alt text-rg-text">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-bold text-rg-text">{title}</h2>
          <p className="mt-1 text-sm text-rg-text-muted">{body}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#365466] px-4 py-3.5">
      <span className="text-sm font-bold text-rg-text">{label}</span>
      <ToggleSwitch label={label} checked={checked} onChange={onChange} />
    </div>
  )
}
