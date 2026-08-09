import { Bike, Footprints, List, Network } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { ProfileSwitchSheet } from '../components/session/ProfileSwitchSheet'
import {
  ActivityMatrix30,
  type DayKind,
} from '../components/session/ActivityMatrix30'
import {
  SmartWindowBar,
  type SmartDay,
} from '../components/session/SmartWindowBar'
import { WeatherForecastModal } from '../components/session/WeatherForecastModal'
import { showSuccessToast } from '../components/overlays/NotificationHost'
import { useReadyGoStore } from '../store/useReadyGoStore'

const SMART_DAYS: SmartDay[] = [
  { id: 'mon', label: 'Mon', dayName: 'Monday', tempC: 16, condition: 'poor', icon: 'rain' },
  { id: 'tue', label: 'Tue', dayName: 'Tuesday', tempC: 18, condition: 'prime', icon: 'sun' },
  { id: 'wed', label: 'Wed', dayName: 'Wednesday', tempC: 17, condition: 'prime', icon: 'sun' },
  { id: 'thu', label: 'Thu', dayName: 'Thursday', tempC: 15, condition: 'poor', icon: 'cloud' },
  { id: 'fri', label: 'Fri', dayName: 'Friday', tempC: 19, condition: 'prime', icon: 'sun' },
  { id: 'sat', label: 'Sat', dayName: 'Saturday', tempC: 14, condition: 'poor', icon: 'rain' },
  { id: 'sun', label: 'Sun', dayName: 'Sunday', tempC: 16, condition: 'passable', icon: 'cloud' },
]

const DEMO_MATRIX: DayKind[] = [
  'session', 'checked', 'session', 'inactive', 'checked', 'session', 'checked',
  'inactive', 'session', 'checked', 'inactive', 'checked', 'session', 'checked',
  'session', 'inactive', 'checked', 'inactive', 'session', 'checked', 'inactive',
  'checked', 'session', 'inactive', 'checked', 'session', 'checked', 'inactive',
  'checked', 'session',
]

const DAY_ONE_MATRIX: DayKind[] = [
  'session',
  ...Array.from({ length: 29 }, () => 'inactive' as DayKind),
]

export function BasecampPage() {
  const navigate = useNavigate()
  const currentProfile = useReadyGoStore((state) => state.currentProfile)
  const savedProfiles = useReadyGoStore((state) => state.savedProfiles)
  const isConfigured = useReadyGoStore((state) => state.isConfigured)
  const savedRoutes = useReadyGoStore((state) => state.savedRoutes)
  const sessionHistory = useReadyGoStore((state) => state.sessionHistory)
  const weather = useReadyGoStore((state) => state.weather)
  const hasSeenSmartWindowIntro = useReadyGoStore(
    (state) => state.hasSeenSmartWindowIntro,
  )
  const markSmartWindowIntroSeen = useReadyGoStore(
    (state) => state.markSmartWindowIntroSeen,
  )
  const setSavedRoutes = useReadyGoStore((state) => state.setSavedRoutes)

  const [switchOpen, setSwitchOpen] = useState(false)
  const [weatherOpen, setWeatherOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<SmartDay | null>(null)

  const profiles =
    savedProfiles.length > 0
      ? savedProfiles
      : currentProfile
        ? [currentProfile]
        : []

  useEffect(() => {
    if (!isConfigured || !currentProfile) {
      navigate('/user/basecamp-setup', { replace: true })
    }
  }, [currentProfile, isConfigured, navigate])

  const isDayOne = sessionHistory.length === 0
  const matrixNodes = isDayOne ? DAY_ONE_MATRIX : DEMO_MATRIX
  const totalMiles = useMemo(() => {
    if (isDayOne) return 0
    return sessionHistory.reduce((sum, route) => sum + route.distanceMiles, 0)
  }, [isDayOne, sessionHistory])
  const sessionsCount = isDayOne ? 1 : Math.max(sessionHistory.length, 10)
  const routeTitle =
    savedRoutes[0]?.name ??
    (currentProfile
      ? `${currentProfile.activityType} Route Ready`
      : 'Your next route')

  if (!isConfigured || !currentProfile) return null

  const ActivityIcon =
    currentProfile.activityType === 'Cycle' ? Bike : Footprints

  const handleReady = () => {
    navigate('/user/session-tuner')
  }

  const handleDayClick = (day: SmartDay) => {
    setSelectedDay(day)
    setWeatherOpen(true)
  }

  const handleGenerateRoute = (day: SmartDay) => {
    const saved = {
      id: crypto.randomUUID(),
      name: `${day.dayName} ${currentProfile.activityType} Route`,
      activityType: currentProfile.activityType,
      distanceKm: 24.5,
      distanceMiles: 15.2,
      difficulty: 'Moderate',
      terrain: currentProfile.activityType === 'Cycle' ? 'Paved' : 'Flat',
      durationMinutes: 96,
      createdAt: new Date().toISOString(),
      startLocation: weather.location,
      endLocation: weather.location,
    }
    setSavedRoutes([saved, ...savedRoutes])
    setWeatherOpen(false)
    showSuccessToast('Route saved', 'Find it anytime in Saved routes.')
  }

  return (
    <div className="relative flex h-full flex-col gap-5 pt-1">
      <section className="rounded-[4px] bg-[#182629] p-4">
        <h2 className="text-base font-bold tracking-[-0.01em] text-[#BACBC9]">
          {routeTitle}
        </h2>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <ActivityIcon
              className="h-5 w-5 shrink-0 text-[#70FF00]"
              aria-hidden="true"
            />
            <p className="truncate text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
              {currentProfile.name}
            </p>
          </div>
          <button
            type="button"
            tabIndex={0}
            aria-label="Switch profile"
            onClick={() => setSwitchOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setSwitchOpen(true)
              }
            }}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-[4px] bg-[#F5F7F7] px-4 text-xs font-medium text-[#0F1918]"
          >
            Switch
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#2D3739] pt-3">
          <div className="flex items-center gap-2">
            <Network size={14} className="shrink-0 text-[#78ABCC]" aria-hidden="true" />
            <p className="text-xs font-bold tracking-[-0.01em] text-[#BACBC9]">
              Times used {currentProfile.timesUsed}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <List size={14} className="shrink-0 text-[#78ABCC]" aria-hidden="true" />
            <p className="text-xs font-bold tracking-[-0.01em] text-[#BACBC9]">
              Saved routes {savedRoutes.length}
            </p>
          </div>
        </div>
      </section>

      <SmartWindowBar
        days={SMART_DAYS}
        bestWindowLabel="Best Window: Tue 6:30 AM (Dry, Light Wind, 18°C)"
        showDayOneIntro={!hasSeenSmartWindowIntro}
        onDayClick={handleDayClick}
        onIntroComplete={markSmartWindowIntroSeen}
      />

      <ActivityMatrix30
        nodes={matrixNodes}
        milesLabel={`${isDayOne ? '0' : totalMiles.toFixed(1)} mi`}
        sessionsLabel={`${sessionsCount} Session${sessionsCount === 1 ? '' : 's'}`}
      />

      <div className="mt-auto flex flex-col gap-3 pb-1">
        <PressableButton
          onClick={handleReady}
          className="rounded-[4px] border-0"
          style={{
            height: 52,
            borderRadius: 4,
            backgroundColor: '#FF3B30',
            color: '#0F1918',
            fontWeight: 700,
          }}
        >
          Ready
        </PressableButton>
      </div>

      <ProfileSwitchSheet
        open={switchOpen}
        onClose={() => setSwitchOpen(false)}
        profiles={profiles}
      />

      <WeatherForecastModal
        open={weatherOpen}
        day={selectedDay}
        location={weather.location}
        onClose={() => setWeatherOpen(false)}
        onGenerateRoute={handleGenerateRoute}
      />
    </div>
  )
}
