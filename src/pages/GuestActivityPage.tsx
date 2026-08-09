import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomSheet } from '../components/ui/BottomSheet'
import { PressableButton } from '../components/ui/PressableButton'
import { SettingsCloseButton } from '../components/settings/SettingsCloseButton'
import { useReadyGoStore } from '../store/useReadyGoStore'
import activityDefault from '../assets/guest/activity-default.png'
import activityCycle from '../assets/guest/activity-cycle.png'
import activityRun from '../assets/guest/activity-run.png'

type ActivityChoice = 'Cycle' | 'Run' | null

export function GuestActivityPage() {
  const navigate = useNavigate()
  const weather = useReadyGoStore((state) => state.weather)
  const setWeather = useReadyGoStore((state) => state.setWeather)
  const updateProfileDraft = useReadyGoStore((state) => state.updateProfileDraft)
  const updateDraftPreferences = useReadyGoStore(
    (state) => state.updateDraftPreferences,
  )
  const guestSession = useReadyGoStore((state) => state.guestSession)
  const setGuestSession = useReadyGoStore((state) => state.setGuestSession)

  const [activity, setActivity] = useState<ActivityChoice>(() =>
    guestSession.activitySelected
      ? useReadyGoStore.getState().profileDraft.activityType
      : null,
  )
  const [locationGranted, setLocationGranted] = useState(
    guestSession.locationGranted,
  )
  const [faqOpen, setFaqOpen] = useState(false)

  const backgroundSrc = useMemo(() => {
    if (activity === 'Cycle') return activityCycle
    if (activity === 'Run') return activityRun
    return activityDefault
  }, [activity])

  const canContinue = Boolean(activity) && locationGranted

  const handleSelectActivity = (next: 'Cycle' | 'Run') => {
    setActivity(next)
    updateProfileDraft({ activityType: next })
    setGuestSession({
      activitySelected: true,
      terrain: next === 'Cycle' ? 'Paved' : 'Flat',
      durationHours: next === 'Cycle' ? 1 : 0.5,
      durationLabel: next === 'Cycle' ? '1 Hour' : '20/30 Mins',
      distanceMiles: next === 'Cycle' ? 15 : 5,
    })
  }

  const handleEnableLocation = () => {
    if (locationGranted) return

    // Prototype: mock grant without a native/browser permissions prompt
    setLocationGranted(true)
    setGuestSession({ locationGranted: true })
    updateDraftPreferences({
      locationMode: 'gps',
      usePhoneLocation: true,
      setCurrentLocation: true,
      locationSettingsOn: true,
    })
    setWeather({
      ...weather,
      location: weather.location || 'Current location',
    })
  }

  const handleContinue = () => {
    if (!canContinue) return
    navigate('/guest/session')
  }

  const activityButtonClass = (optionId: 'Cycle' | 'Run') => {
    const active = activity === optionId
    if (active) {
      return 'border-[#FF3B30] bg-[#FF3B30] text-[#0F191B]'
    }
    if (activity === null) {
      return 'border-transparent bg-[#BACBC9] text-[#0F191B]'
    }
    return 'border-[#2D3739] bg-[#182629]/80 text-[#BACBC9]'
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#0F1918]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={backgroundSrc}
          src={backgroundSrc}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute inset-0 size-full object-cover"
          draggable={false}
        />
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col">
        <header className="shrink-0 px-4 pt-[max(2.5rem,env(safe-area-inset-top))]">
          <h1 className="text-center font-display text-xl font-bold uppercase tracking-[-0.02em] text-[#BACBC9]">
            Set
          </h1>
        </header>

        <div className="mt-auto bg-gradient-to-t from-[#0F1918] via-[#0F1918]/90 to-transparent px-4 pb-8 pt-12">
          <p className="mb-4 text-center font-sans text-sm leading-relaxed text-[#BACBC9]">
            Choose your activity to base your session on.
          </p>

          <div className="mb-3 grid grid-cols-2 gap-3">
            {([
              { id: 'Cycle' as const, label: 'Cycling' },
              { id: 'Run' as const, label: 'Running' },
            ]).map((option) => (
              <button
                key={option.id}
                type="button"
                tabIndex={0}
                aria-pressed={activity === option.id}
                aria-label={option.label}
                onClick={() => handleSelectActivity(option.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleSelectActivity(option.id)
                  }
                }}
                className={`h-12 rounded-xl border text-sm font-bold tracking-[-0.01em] transition-colors ${activityButtonClass(option.id)}`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            tabIndex={0}
            aria-label={
              locationGranted ? 'Location Enabled' : 'Enable Location Access'
            }
            aria-pressed={locationGranted}
            onClick={handleEnableLocation}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleEnableLocation()
              }
            }}
            className={`mb-3 flex h-12 w-full items-center justify-center rounded-[4px] text-sm font-bold tracking-[-0.01em] transition-colors ${
              locationGranted
                ? 'bg-[#BACBC9] text-[#0F191B]'
                : 'bg-[#2D3739] text-[#BACBC9]'
            }`}
          >
            {locationGranted
              ? 'Location Enabled'
              : 'Enable Location Access'}
          </button>

          <PressableButton
            disabled={!canContinue}
            onClick={handleContinue}
            className="rounded-[4px] border-0 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              height: 52,
              borderRadius: 4,
              backgroundColor: canContinue ? '#70FF00' : '#2D3739',
              color: canContinue ? '#0F191B' : '#BACBC9',
            }}
          >
            Continue
          </PressableButton>

          <button
            type="button"
            tabIndex={0}
            aria-label="Why we need your location"
            onClick={() => setFaqOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setFaqOpen(true)
              }
            }}
            className="mt-4 w-full text-center font-sans text-sm font-bold text-[#BACBC9] underline underline-offset-2"
          >
            Why we need your location
          </button>
        </div>
      </div>

      <BottomSheet open={faqOpen} onClose={() => setFaqOpen(false)} tone="light">
        <div className="flex flex-col gap-4 pb-2 pt-1 text-[#0F191B]">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.02em]">
              Location
            </h2>
            <SettingsCloseButton
              variant="onLight"
              onClick={() => setFaqOpen(false)}
            />
          </div>
          <p className="font-sans text-base leading-relaxed">
            ReadyGo uses your location to build routes that actually start where
            you are — not somewhere nearby. Right here.
          </p>
          <p className="font-sans text-base leading-relaxed">
            Not a fan of sharing location? No bother — you can set a home
            postcode in your profile instead once you sign up.
          </p>
          <PressableButton variant="cta" onClick={() => setFaqOpen(false)}>
            Got it
          </PressableButton>
        </div>
      </BottomSheet>
    </div>
  )
}
