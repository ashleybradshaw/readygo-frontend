import { Bike, List, Network, PersonStanding } from 'lucide-react'
import { useMemo, useRef, useState, type ComponentType } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { PaginationDots } from '../components/ui/PaginationDots'
import { ProfileInstructionsModal } from '../components/onboarding/ProfileInstructionsModal'
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
import {
  ClothingCardIcon,
  GoaiCardIcon,
  InfoCalloutIcon,
  ListCardIcon,
  LocationCardIcon,
  MapsCardIcon,
  TimeCardIcon,
  WeatherCardIcon,
} from '../components/ui/BasecampIcons'
import { showSuccessToast } from '../components/overlays/NotificationHost'
import { useReadyGoStore } from '../store/useReadyGoStore'

type CardIcon = ComponentType<{ className?: string; size?: number }>

const previewCards: {
  title: string
  body: string
  icon: CardIcon
}[] = [
  {
    title: 'Set location for routes',
    body: 'Where you start shapes your route. Set your current GPS location or drop a home postcode – ReadyGo builds from there.',
    icon: LocationCardIcon,
  },
  {
    title: 'Session times',
    body: 'Morning runner? Evening cyclist? Let us know when you usually head out so your plan fits your day.',
    icon: TimeCardIcon,
  },
  {
    title: 'AI session builder',
    body: 'GOAI takes your preferences and builds your session – route, duration, effort level – every time you tap Ready.',
    icon: GoaiCardIcon,
  },
  {
    title: 'Weather',
    body: "Tell us what weather you'll head out in. Dry only, or fine with a bit of drizzle? ReadyGo will only suggest sessions that match.",
    icon: WeatherCardIcon,
  },
  {
    title: 'Clothing',
    body: 'ReadyGo can suggest what to wear based on live conditions. Layers, waterproof, base layer – no more standing at the door guessing.',
    icon: ClothingCardIcon,
  },
  {
    title: 'Maps',
    body: 'Choose how your route is displayed – simple minimap, or full navigation mode. Loop routes or point-to-point, your call.',
    icon: MapsCardIcon,
  },
  {
    title: 'Save session & compare',
    body: "Save completed sessions and see how you're building over time – week by week, month by month.",
    icon: ListCardIcon,
  },
]

const CARD_SIDE_INSET = '9%'

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
  const resetProfileDraft = useReadyGoStore((state) => state.resetProfileDraft)
  const setSavedRoutes = useReadyGoStore((state) => state.setSavedRoutes)

  const [previewIndex, setPreviewIndex] = useState(0)
  const [instructionsOpen, setInstructionsOpen] = useState(false)
  const [switchOpen, setSwitchOpen] = useState(false)
  const [weatherOpen, setWeatherOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<SmartDay | null>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const isProgrammaticScroll = useRef(false)

  const profiles =
    savedProfiles.length > 0
      ? savedProfiles
      : currentProfile
        ? [currentProfile]
        : []

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

  const handleScrollerScroll = () => {
    if (isProgrammaticScroll.current) return
    const scroller = scrollerRef.current
    if (!scroller) return

    const cards = [
      ...scroller.querySelectorAll<HTMLElement>('[data-preview-card]'),
    ]
    if (cards.length === 0) return

    const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const distance = Math.abs(cardCenter - viewportCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    setPreviewIndex((current) =>
      current === closestIndex ? current : closestIndex,
    )
  }

  const scrollToCard = (index: number) => {
    const scroller = scrollerRef.current
    const card = scroller?.querySelectorAll<HTMLElement>('[data-preview-card]')[
      index
    ]
    if (!scroller || !card) return

    isProgrammaticScroll.current = true
    setPreviewIndex(index)
    card.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
    window.setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 420)
  }

  const handleReady = () => {
    navigate('/user/session-tuner')
  }

  const handleDayClick = (day: SmartDay) => {
    setSelectedDay(day)
    setWeatherOpen(true)
  }

  const handleGenerateRoute = (day: SmartDay) => {
    if (!currentProfile) return
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

  if (!isConfigured || !currentProfile) {
    return (
      <div className="relative flex h-full flex-col gap-4 pt-1">
        <section className="flex gap-3 rounded border border-[#365466] bg-[#1C2A33] p-[16.5px] shadow-[0px_4px_3px_rgba(0,0,0,0.1),0px_10px_15px_rgba(0,0,0,0.1)]">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-[2px] bg-[#365466]">
            <InfoCalloutIcon />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold capitalize leading-5 tracking-[-1px] text-[#78ABCC]">
              Your first profile.
            </p>
            <p className="mt-1 text-xs leading-4 text-[#78ABCC]/80">
              Have a look at what we&apos;ll ask you and why – then we&apos;ll
              build your first ReadyGo profile.
            </p>
          </div>
        </section>

        <div className="-mx-5">
          <div
            ref={scrollerRef}
            onScroll={handleScrollerScroll}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{
              scrollSnapType: 'x mandatory',
              paddingInline: CARD_SIDE_INSET,
            }}
            aria-label="Profile setup preview cards"
          >
            {previewCards.map((card) => {
              const Icon = card.icon
              return (
                <article
                  key={card.title}
                  data-preview-card
                  className="flex min-h-[196px] w-full shrink-0 snap-center flex-col items-center justify-center gap-[5px] rounded border border-[#BACBC9]/40 bg-[#0F191B] px-5 py-8 text-center"
                  style={{
                    flex: '0 0 100%',
                    scrollSnapAlign: 'center',
                    scrollSnapStop: 'always',
                  }}
                >
                  <Icon size={24} />
                  <h2 className="font-display text-base font-bold uppercase leading-6 tracking-[-0.01em] text-[#BACBC9]">
                    {card.title}
                  </h2>
                  <p className="max-w-[280px] text-sm leading-5 tracking-[-0.01em] text-[#BACBC9]">
                    {card.body}
                  </p>
                </article>
              )
            })}
          </div>
        </div>

        <PaginationDots
          count={previewCards.length}
          activeIndex={previewIndex}
          inactiveColor="#4F6163"
          onDotClick={scrollToCard}
        />

        <PressableButton
          variant="cta"
          onClick={() => setInstructionsOpen(true)}
        >
          Set up your first profile
        </PressableButton>

        <ProfileInstructionsModal
          open={instructionsOpen}
          onClose={() => setInstructionsOpen(false)}
          onContinue={() => {
            resetProfileDraft()
            setInstructionsOpen(false)
            navigate('/user/location-activity')
          }}
        />
      </div>
    )
  }

  const ActivityIcon =
    currentProfile.activityType === 'Cycle' ? Bike : PersonStanding

  return (
    <div className="relative flex h-full flex-col gap-5 pt-1">
      <section className="rounded-[4px] bg-[#182629] p-4">
        <h2 className="text-base font-bold tracking-[-0.01em] text-[#BACBC9]">
          {routeTitle}
        </h2>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <ActivityIcon
              size={18}
              className="shrink-0 text-[#70FF00]"
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
