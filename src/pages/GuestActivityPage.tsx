import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { LocationInfoSheet } from '../components/onboarding/LocationInfoSheet'
import { PressableButton } from '../components/ui/PressableButton'
import { useReadyGoStore } from '../store/useReadyGoStore'
import bgDual from '../assets/intro/bg-dual.png'
import bgCycling from '../assets/intro/bg-cycling.png'
import bgRunning from '../assets/intro/bg-running.png'

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
    if (activity === 'Cycle') return bgCycling
    if (activity === 'Run') return bgRunning
    return bgDual
  }, [activity])

  const canContinue = Boolean(activity) && locationGranted

  const handleSelectActivity = (next: 'Cycle' | 'Run') => {
    setActivity(next)
    updateProfileDraft({ activityType: next })
    setGuestSession({
      activitySelected: true,
      terrain: next === 'Cycle' ? 'Paved' : 'Flat',
      durationHours: next === 'Cycle' ? 1 : 0.5,
      durationLabel: next === 'Cycle' ? '1 Hr' : '20-30 Min',
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
      <img
        src={bgDual}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ease-in-out ${
          backgroundSrc === bgDual ? 'opacity-100' : 'opacity-0'
        }`}
        draggable={false}
      />
      <img
        src={bgCycling}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ease-in-out ${
          backgroundSrc === bgCycling ? 'opacity-100' : 'opacity-0'
        }`}
        draggable={false}
      />
      <img
        src={bgRunning}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ease-in-out ${
          backgroundSrc === bgRunning ? 'opacity-100' : 'opacity-0'
        }`}
        draggable={false}
      />

      <button
        type="button"
        tabIndex={0}
        aria-label="Close"
        onClick={() => navigate('/welcome')}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            navigate('/welcome')
          }
        }}
        className="absolute top-6 right-6 z-20 cursor-pointer text-[#BACBC9]/60 hover:text-white"
      >
        <X className="h-6 w-6" strokeWidth={2.25} aria-hidden="true" />
      </button>

      <div className="relative z-10 flex h-full flex-col">
        <p
          className="absolute top-[28%] left-1/2 -translate-x-1/2 font-display text-3xl font-black uppercase tracking-widest text-white"
          aria-hidden="true"
        >
          Set
        </p>
        <h1 className="sr-only">Set</h1>

        <div className="mt-auto bg-gradient-to-t from-[#0F1918] via-[#0F1918]/90 to-transparent px-4 pb-8 pt-12">
          <p className="mb-4 text-center font-sans text-sm leading-relaxed text-[#BACBC9]">
            Choose your activity to base your session on.
          </p>

          <div className="mb-3 grid grid-cols-2 gap-3">
            {(
              [
                { id: 'Cycle' as const, label: 'Cycling' },
                { id: 'Run' as const, label: 'Running' },
              ] as const
            ).map((option) => (
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
                className={`h-12 rounded-[4px] border text-sm font-bold tracking-[-0.01em] transition-colors ${activityButtonClass(option.id)}`}
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

      <LocationInfoSheet open={faqOpen} onClose={() => setFaqOpen(false)} />
    </div>
  )
}
