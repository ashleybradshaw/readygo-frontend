import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState, type ComponentType } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { PaginationDots } from '../components/ui/PaginationDots'
import { ProfileOverviewCard } from '../components/session/ProfileOverviewCard'
import { ActivityChart } from '../components/session/ActivityChart'
import { ProfileInstructionsModal } from '../components/onboarding/ProfileInstructionsModal'
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
import { buildSessionManifest } from '../lib/session'
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

export function BasecampPage() {
  const navigate = useNavigate()
  const currentProfile = useReadyGoStore((state) => state.currentProfile)
  const savedProfiles = useReadyGoStore((state) => state.savedProfiles)
  const isConfigured = useReadyGoStore((state) => state.isConfigured)
  const savedRoutes = useReadyGoStore((state) => state.savedRoutes)
  const chartRange = useReadyGoStore((state) => state.chartRange)
  const activityByRange = useReadyGoStore((state) => state.activityByRange)
  const weather = useReadyGoStore((state) => state.weather)
  const oneTimeSessionHours = useReadyGoStore((state) => state.oneTimeSessionHours)
  const setChartRange = useReadyGoStore((state) => state.setChartRange)
  const activateProfile = useReadyGoStore((state) => state.activateProfile)
  const beginSessionBuild = useReadyGoStore((state) => state.beginSessionBuild)
  const resetProfileDraft = useReadyGoStore((state) => state.resetProfileDraft)

  const [previewIndex, setPreviewIndex] = useState(0)
  const [profileIndex, setProfileIndex] = useState(0)
  const [instructionsOpen, setInstructionsOpen] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const profileScrollerRef = useRef<HTMLDivElement>(null)
  const isProgrammaticScroll = useRef(false)
  const isProfileProgrammaticScroll = useRef(false)

  const profiles =
    savedProfiles.length > 0
      ? savedProfiles
      : currentProfile
        ? [currentProfile]
        : []

  useEffect(() => {
    if (!currentProfile || profiles.length === 0) return
    const activeIndex = profiles.findIndex(
      (profile) => profile.id === currentProfile.id,
    )
    if (activeIndex >= 0 && activeIndex !== profileIndex) {
      setProfileIndex(activeIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync when active profile changes
  }, [currentProfile?.id, profiles.length])

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

  const handleProfileScroll = () => {
    if (isProfileProgrammaticScroll.current) return
    const scroller = profileScrollerRef.current
    if (!scroller) return

    const cards = [
      ...scroller.querySelectorAll<HTMLElement>('[data-profile-card]'),
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

    setProfileIndex((current) =>
      current === closestIndex ? current : closestIndex,
    )
  }

  const scrollToProfile = (index: number) => {
    const scroller = profileScrollerRef.current
    const card = scroller?.querySelectorAll<HTMLElement>('[data-profile-card]')[
      index
    ]
    if (!scroller || !card) return

    isProfileProgrammaticScroll.current = true
    setProfileIndex(index)
    card.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
    window.setTimeout(() => {
      isProfileProgrammaticScroll.current = false
    }, 420)
  }

  const handleReady = () => {
    if (!currentProfile) return
    const session = buildSessionManifest({
      profile: currentProfile,
      weather,
      hours: oneTimeSessionHours,
    })
    beginSessionBuild(session)
    navigate('/session/gathering')
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
            navigate('/setup')
          }}
        />
      </div>
    )
  }

  return (
    <div className="relative flex h-full flex-col gap-4 pt-1">
      <div className="-mx-5">
        <div
          ref={profileScrollerRef}
          onScroll={handleProfileScroll}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            scrollSnapType: 'x mandatory',
            paddingInline: '1.25rem',
          }}
          aria-label="Saved profiles"
        >
          {profiles.map((profile) => (
            <div
              key={profile.id}
              data-profile-card
              className="w-full shrink-0 snap-center"
              style={{
                flex: '0 0 100%',
                scrollSnapAlign: 'center',
                scrollSnapStop: 'always',
              }}
            >
              <ProfileOverviewCard
                profile={profile}
                savedRoutesCount={savedRoutes.length}
                isActive={profile.id === currentProfile.id}
                onActivate={() => activateProfile(profile.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {profiles.length > 1 ? (
        <div className="flex items-center justify-between gap-3 px-1">
          <button
            type="button"
            tabIndex={0}
            aria-label="Previous profile"
            disabled={profileIndex <= 0}
            onClick={() => scrollToProfile(Math.max(0, profileIndex - 1))}
            className="text-[#BACBC9] disabled:opacity-30"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <PaginationDots
            count={profiles.length}
            activeIndex={profileIndex}
            inactiveColor="#4F6163"
            onDotClick={scrollToProfile}
          />
          <button
            type="button"
            tabIndex={0}
            aria-label="Next profile"
            disabled={profileIndex >= profiles.length - 1}
            onClick={() =>
              scrollToProfile(Math.min(profiles.length - 1, profileIndex + 1))
            }
            className="text-[#BACBC9] disabled:opacity-30"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <PaginationDots
          count={1}
          activeIndex={0}
          inactiveColor="#4F6163"
        />
      )}

      <ActivityChart
        points={activityByRange[chartRange]}
        range={chartRange}
        onRangeChange={setChartRange}
      />

      <div className="mt-auto flex flex-col gap-3 pb-1">
        <PressableButton
          onClick={handleReady}
          className="border-0"
          style={{
            height: 52,
            borderRadius: 12,
            backgroundColor: '#FF3B30',
            color: '#0F191B',
          }}
        >
          Ready
        </PressableButton>
      </div>
    </div>
  )
}
