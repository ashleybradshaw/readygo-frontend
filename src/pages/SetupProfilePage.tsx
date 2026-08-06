import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bike, Clock, MapPin, Navigation2, PersonStanding, Shirt, Sun } from 'lucide-react'
import { PressableButton } from '../components/ui/PressableButton'
import { PaginationDots } from '../components/ui/PaginationDots'
import { ProgressBar } from '../components/ui/ProgressBar'
import { ToggleSwitch } from '../components/ui/ToggleSwitch'
import { CancelProfileModal } from '../components/onboarding/CancelProfileModal'
import {
  QuestionHeaderCard,
  QuestionSectionDivider,
  QuestionSectionStack,
  QuestionToggleRow,
  WeatherConditionBadge,
} from '../components/setup/QuestionStepCard'
import { calculateSetupProgress } from '../lib/onboarding'
import {
  type FitnessLevel,
  type PreferredTime,
  type ProfilePreferences,
  type SessionDuration,
  type WeatherChoice,
  useReadyGoStore,
} from '../store/useReadyGoStore'
import iconClose from '../assets/setup/icon-close.svg'
import iconArrowLeft from '../assets/setup/icon-arrow-left.svg'
import iconArrowRight from '../assets/setup/icon-arrow-right.svg'
import iconPostcode from '../assets/setup/icon-postcode.svg'
import iconGoai from '../assets/basecamp/icon-goai.svg'

const STEPS = [
  'location',
  'times',
  'fitness',
  'weather',
  'clothing',
  'maps',
] as const

type StepId = (typeof STEPS)[number]

const TIME_OPTIONS: { value: PreferredTime; label: string }[] = [
  { value: 'Morning', label: 'The Morning' },
  { value: 'Afternoon', label: 'The Afternoon' },
  { value: 'Evening', label: 'In The Evening' },
]

const FITNESS_BASE: { value: FitnessLevel; label: string }[] = [
  { value: 'Just starting out', label: 'Just Starting Out' },
  { value: 'Been doing this a while', label: 'Been Doing This A While' },
]

const DURATION_OPTIONS: { value: SessionDuration; label: string }[] = [
  { value: 'Under an hour', label: 'Under An Hour' },
  { value: 'Under two hours', label: 'Under Two Hours' },
  { value: 'Under three hours', label: 'Under Three Hours' },
  { value: 'Over three hours', label: 'Over Three Hours' },
  { value: 'Surprise me', label: 'Surprise Me ( Within Five Hours)' },
]

const WEATHER_OPTIONS: { value: WeatherChoice; label: string }[] = [
  { value: 'Only sunshine', label: 'Only Sunshine' },
  { value: 'Only when dry', label: "Only When It's Dry" },
  { value: 'Bit of drizzle', label: 'A Bit Of Drizzle Is Fine' },
  { value: 'Light rain', label: 'Light Rain – No Problem' },
  { value: 'Cats and dogs', label: 'Cats And Dogs (Any)' },
  { value: 'Cold or snow', label: 'Cold Weather Or Snow' },
]

const MaskedIcon = ({
  src,
  className = 'size-5',
  toneClass = 'bg-[#0F191B]',
}: {
  src: string
  className?: string
  toneClass?: string
}) => (
  <span
    className={`inline-block shrink-0 ${className} ${toneClass}`}
    style={{
      maskImage: `url(${src})`,
      WebkitMaskImage: `url(${src})`,
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
    }}
    aria-hidden="true"
  />
)

export function SetupProfilePage() {
  const navigate = useNavigate()
  const userName = useReadyGoStore((state) => state.userName)
  const draft = useReadyGoStore((state) => state.profileDraft)
  const updateProfileDraft = useReadyGoStore((state) => state.updateProfileDraft)
  const updateDraftPreferences = useReadyGoStore(
    (state) => state.updateDraftPreferences,
  )
  const resetProfileDraft = useReadyGoStore((state) => state.resetProfileDraft)

  const [stepIndex, setStepIndex] = useState(0)
  const [cancelOpen, setCancelOpen] = useState(false)
  const step = STEPS[stepIndex]

  const progress = useMemo(
    () => calculateSetupProgress(draft.preferences),
    [draft.preferences],
  )

  const greeting = `Hello, ${userName || 'there'}`
  const isCycle = draft.activityType === 'Cycle'

  const handleActivityToggle = (toCycle: boolean) => {
    const nextType = toCycle ? 'Cycle' : 'Run'
    updateProfileDraft({ activityType: nextType })

    const fitness = draft.preferences.fitnessLevel
    if (nextType === 'Run' && fitness === 'Yellow jersey') {
      updateDraftPreferences({ fitnessLevel: 'Redline pace' })
    }
    if (nextType === 'Cycle' && fitness === 'Redline pace') {
      updateDraftPreferences({ fitnessLevel: 'Yellow jersey' })
    }
  }

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) setStepIndex((value) => value + 1)
  }

  const goPrev = () => {
    if (stepIndex > 0) setStepIndex((value) => value - 1)
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#0F191B] px-5 pb-6 pt-[39px]">
      <button
        type="button"
        aria-label="Close setup"
        onClick={() => setCancelOpen(true)}
        className="absolute top-[39px] right-5 flex size-11 items-center justify-center"
      >
        <img src={iconClose} alt="" width={44} height={44} className="size-11" />
      </button>

      <div className="mb-5 pr-12">
        <h1 className="font-display text-2xl font-bold uppercase leading-8 tracking-[-0.02em] text-[#BACBC9]">
          {greeting}
        </h1>
        <p className="mt-[5px] font-sans text-lg font-bold uppercase leading-[26px] tracking-[-0.01em] text-[#BACBC9]">
          Setting up · {progress}% complete
        </p>
        <div className="mt-[5px]">
          <ProgressBar value={progress} />
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between rounded-[10px] bg-[#182629] px-5 py-2.5">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => handleActivityToggle(false)}
            className={`flex items-center gap-[5px] p-2.5 ${
              !isCycle ? 'text-[#70FF00]' : 'text-[#647A7C]'
            }`}
          >
            <PersonStanding size={24} strokeWidth={1.75} aria-hidden="true" />
            <span className="text-base font-bold tracking-[-0.01em]">Run</span>
          </button>
          <button
            type="button"
            onClick={() => handleActivityToggle(true)}
            className={`flex items-center gap-[5px] p-2.5 ${
              isCycle ? 'text-[#70FF00]' : 'text-[#647A7C]'
            }`}
          >
            <Bike size={24} strokeWidth={1.75} aria-hidden="true" />
            <span className="text-base font-bold tracking-[-0.01em]">Cycle</span>
          </button>
        </div>
        <ToggleSwitch
          label="Activity type"
          checked={isCycle}
          onChange={handleActivityToggle}
        />
      </div>

      <div className="mb-2 flex items-center justify-center gap-[15px] py-[15px]">
        <button
          type="button"
          aria-label="Previous step"
          onClick={goPrev}
          disabled={stepIndex === 0}
          className="disabled:opacity-35"
        >
          <img
            src={iconArrowLeft}
            alt=""
            width={24}
            height={24}
            className="size-6"
          />
        </button>
        <PaginationDots
          count={STEPS.length}
          activeIndex={stepIndex}
          activeWidth={28}
          inactiveColor="#4F6163"
          onDotClick={setStepIndex}
        />
        <button
          type="button"
          aria-label="Next step"
          onClick={goNext}
          disabled={stepIndex === STEPS.length - 1}
          className="disabled:opacity-35"
        >
          <img
            src={iconArrowRight}
            alt=""
            width={24}
            height={24}
            className="size-6"
          />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          >
            <StepPanel
              step={step}
              activityType={draft.activityType}
              prefs={draft.preferences}
              updateDraftPreferences={updateDraftPreferences}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pt-2">
        <PressableButton
          variant="cta"
          onClick={() => navigate('/setup/gathering')}
        >
          Review and Go
        </PressableButton>
      </div>

      <CancelProfileModal
        open={cancelOpen}
        onStay={() => setCancelOpen(false)}
        onCancel={() => {
          resetProfileDraft()
          setCancelOpen(false)
          navigate('/')
        }}
      />
    </div>
  )
}

function StepPanel({
  step,
  activityType,
  prefs,
  updateDraftPreferences,
}: {
  step: StepId
  activityType: 'Run' | 'Cycle'
  prefs: ProfilePreferences
  updateDraftPreferences: (partial: Partial<ProfilePreferences>) => void
}) {
  const advancedFitness: FitnessLevel =
    activityType === 'Run' ? 'Redline pace' : 'Yellow jersey'
  const advancedLabel =
    activityType === 'Run' ? 'Redline Pace Mode' : 'Yellow Jersey Mode'

  const toggleMulti = <T extends string>(
    list: T[],
    value: T,
    key: 'preferredTimes' | 'weatherChoices',
  ) => {
    const next = list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value]
    updateDraftPreferences({ [key]: next } as Partial<ProfilePreferences>)
  }

  if (step === 'location') {
    return (
      <QuestionSectionStack>
        <QuestionHeaderCard
          icon={<Navigation2 size={20} strokeWidth={2} />}
          title="Set Location For Routes"
          body="ReadyGo needs a starting point to build your route. Use your current GPS, set a home location, or enter a postcode."
        />
        <QuestionToggleRow
          label="Turn On Location Settings"
          checked={prefs.locationSettingsOn}
          onChange={(checked) =>
            updateDraftPreferences({ locationSettingsOn: checked })
          }
        />
        <QuestionToggleRow
          label="Use Phone's Location"
          checked={prefs.usePhoneLocation}
          onChange={(checked) =>
            updateDraftPreferences({
              usePhoneLocation: checked,
              locationMode: checked ? 'gps' : prefs.locationMode,
            })
          }
        />
        <QuestionToggleRow
          label="Set Current Location"
          checked={prefs.setCurrentLocation}
          onChange={(checked) =>
            updateDraftPreferences({
              setCurrentLocation: checked,
              locationMode: checked ? 'home' : prefs.locationMode,
            })
          }
        />
        <div className="flex h-[54px] items-center gap-2.5 rounded-b-[10px] rounded-t-none bg-[#182629] px-5">
          <img
            src={iconPostcode}
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0"
          />
          <input
            type="text"
            aria-label="Postcode"
            placeholder="Type your post code (Optional)"
            value={prefs.postcode}
            onChange={(event) =>
              updateDraftPreferences({
                postcode: event.target.value,
                locationMode: 'postcode',
              })
            }
            className="min-w-0 flex-1 bg-transparent text-base font-bold tracking-[-0.01em] text-[#BACBC9] outline-none placeholder:text-[#BACBC9]/70"
          />
        </div>
      </QuestionSectionStack>
    )
  }

  if (step === 'times') {
    return (
      <QuestionSectionStack>
        <QuestionHeaderCard
          icon={<Clock size={20} strokeWidth={2} />}
          title="Times"
          body="When do you usually head out? ReadyGo will tailor session suggestions to fit your schedule."
        />
        {TIME_OPTIONS.map((option, index) => (
          <QuestionToggleRow
            key={option.value}
            label={option.label}
            checked={prefs.preferredTimes.includes(option.value)}
            onChange={() =>
              toggleMulti(prefs.preferredTimes, option.value, 'preferredTimes')
            }
            roundBottom={index === TIME_OPTIONS.length - 1}
          />
        ))}
      </QuestionSectionStack>
    )
  }

  if (step === 'fitness') {
    const fitnessOptions = [
      ...FITNESS_BASE,
      { value: advancedFitness, label: advancedLabel },
    ]

    return (
      <QuestionSectionStack>
        <QuestionHeaderCard
          icon={<MaskedIcon src={iconGoai} />}
          title="AI Sessions"
          body="How would you describe your current fitness level? This helps GOAI set the right starting point."
        />
        {fitnessOptions.map((option) => (
          <QuestionToggleRow
            key={option.value}
            label={option.label}
            checked={prefs.fitnessLevel === option.value}
            onChange={() =>
              updateDraftPreferences({ fitnessLevel: option.value })
            }
          />
        ))}
        <QuestionSectionDivider />
        {DURATION_OPTIONS.map((option, index) => (
          <QuestionToggleRow
            key={option.value}
            label={option.label}
            checked={prefs.sessionDuration === option.value}
            onChange={() =>
              updateDraftPreferences({ sessionDuration: option.value })
            }
            roundBottom={index === DURATION_OPTIONS.length - 1}
          />
        ))}
      </QuestionSectionStack>
    )
  }

  if (step === 'weather') {
    return (
      <QuestionSectionStack>
        <QuestionHeaderCard
          icon={<Sun size={20} strokeWidth={2} />}
          title="Weather"
          body="Which conditions are you happy heading out in? ReadyGo will only plan sessions in weather that suits you."
        />
        {WEATHER_OPTIONS.map((option, index) => (
          <QuestionToggleRow
            key={option.value}
            label={option.label}
            leading={<WeatherConditionBadge choice={option.value} />}
            checked={prefs.weatherChoices.includes(option.value)}
            onChange={() =>
              toggleMulti(prefs.weatherChoices, option.value, 'weatherChoices')
            }
            roundBottom={index === WEATHER_OPTIONS.length - 1}
          />
        ))}
      </QuestionSectionStack>
    )
  }

  if (step === 'clothing') {
    return (
      <QuestionSectionStack>
        <QuestionHeaderCard
          icon={<Shirt size={20} strokeWidth={2} />}
          title="Clothing"
          body="Want ReadyGo to suggest what to wear? Based on the conditions and your route."
        />
        <QuestionToggleRow
          label="Suggest Clothing"
          checked={prefs.clothingSuggestions}
          onChange={(checked) =>
            updateDraftPreferences({ clothingSuggestions: checked })
          }
        />
        <QuestionToggleRow
          label="Show Links To New Gear"
          checked={prefs.showGearLinks}
          onChange={(checked) =>
            updateDraftPreferences({ showGearLinks: checked })
          }
          roundBottom
        />
      </QuestionSectionStack>
    )
  }

  return (
    <QuestionSectionStack>
      <QuestionHeaderCard
        icon={<MapPin size={20} strokeWidth={2} />}
        title="Maps"
        body="How do you want your route displayed while you're out?"
      />
      <QuestionToggleRow
        label="Show Simple Maps"
        checked={prefs.showSimpleMaps}
        onChange={(checked) =>
          updateDraftPreferences({
            showSimpleMaps: checked,
            mapStyle: checked ? 'Minimap' : 'Full navigation',
          })
        }
      />
      <QuestionToggleRow
        label="Show Traffic"
        checked={prefs.showTraffic}
        onChange={(checked) => updateDraftPreferences({ showTraffic: checked })}
      />
      <QuestionToggleRow
        label="Loop Or Single Destination"
        checked={prefs.loopOrSingleDestination}
        onChange={(checked) =>
          updateDraftPreferences({ loopOrSingleDestination: checked })
        }
        roundBottom
      />
    </QuestionSectionStack>
  )
}
