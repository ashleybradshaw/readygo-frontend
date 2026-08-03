import { Info } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { PaginationDots } from '../components/ui/PaginationDots'
import { ProfileOverviewCard } from '../components/session/ProfileOverviewCard'
import { ActivityChart } from '../components/session/ActivityChart'
import { useReadyGoStore } from '../store/useReadyGoStore'

const previewCards = [
  {
    title: 'Set location for routes',
    body: 'Where you start shapes your route. Set your current GPS location or drop a home postcode – ReadyGo builds from there.',
  },
  {
    title: 'Session times',
    body: 'Morning runner? Evening cyclist? Let us know when you usually head out so your plan fits your day.',
  },
  {
    title: 'AI session builder',
    body: 'GOAI takes your preferences and builds your session – route, duration, effort level – every time you tap Ready.',
  },
  {
    title: 'Weather',
    body: "Tell us what weather you'll head out in. Dry only, or fine with a bit of drizzle? ReadyGo will only suggest sessions that match.",
  },
  {
    title: 'Clothing',
    body: 'ReadyGo can suggest what to wear based on live conditions. Layers, waterproof, base layer – no more standing at the door guessing.',
  },
  {
    title: 'Maps',
    body: 'Choose how your route is displayed – simple minimap, or full navigation mode. Loop routes or point-to-point, your call.',
  },
  {
    title: 'Save session & compare',
    body: "Save completed sessions and see how you're building over time – week by week, month by month.",
  },
]

export function BasecampPage() {
  const navigate = useNavigate()
  const currentProfile = useReadyGoStore((state) => state.currentProfile)
  const isConfigured = useReadyGoStore((state) => state.isConfigured)
  const savedRoutes = useReadyGoStore((state) => state.savedRoutes)
  const chartRange = useReadyGoStore((state) => state.chartRange)
  const activityByRange = useReadyGoStore((state) => state.activityByRange)
  const setChartRange = useReadyGoStore((state) => state.setChartRange)
  const setSessionMenuOpen = useReadyGoStore((state) => state.setSessionMenuOpen)

  const [previewIndex, setPreviewIndex] = useState(0)

  if (!isConfigured || !currentProfile) {
    const card = previewCards[previewIndex]
    return (
      <div className="flex h-full flex-col gap-4 pt-1">
        <section className="flex gap-3 rounded-[12px] bg-rg-surface p-4 outline outline-1 outline-[#365466]">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#4C8DFF]/20 text-[#4C8DFF]">
            <Info size={14} />
          </div>
          <div>
            <p className="text-sm font-bold capitalize text-[#8EB7FF]">
              Your first profile.
            </p>
            <p className="mt-1 text-sm text-rg-text-muted">
              Have a look at what we&apos;ll ask you and why – then we&apos;ll
              build your first ReadyGo profile.
            </p>
          </div>
        </section>

        <div className="relative min-h-[198px] flex-1">
          <AnimatePresence mode="wait">
            <motion.section
              key={card.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60 && previewIndex < previewCards.length - 1) {
                  setPreviewIndex((value) => value + 1)
                }
                if (info.offset.x > 60 && previewIndex > 0) {
                  setPreviewIndex((value) => value - 1)
                }
              }}
              className="rounded-[12px] bg-rg-surface p-5 outline outline-1 outline-[#365466]"
            >
              <h2 className="text-base font-bold uppercase tracking-[-0.01em] text-rg-text">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-5 text-rg-text-muted">
                {card.body}
              </p>
            </motion.section>
          </AnimatePresence>
        </div>

        <PaginationDots
          count={previewCards.length}
          activeIndex={previewIndex}
        />

        <PressableButton onClick={() => navigate('/setup')}>
          Set up your first profile
        </PressableButton>
      </div>
    )
  }

  return (
    <div className="relative flex h-full flex-col gap-4 pt-1">
      <ProfileOverviewCard
        profile={currentProfile}
        savedRoutesCount={savedRoutes.length}
      />

      <ActivityChart
        points={activityByRange[chartRange]}
        range={chartRange}
        onRangeChange={setChartRange}
      />

      <div className="mt-auto flex flex-col gap-3 pb-1">
        <PressableButton
          className="bg-rg-red-cta text-rg-text-on-accent hover:bg-rg-red-bright"
          onClick={() => setSessionMenuOpen(true)}
        >
          READY
        </PressableButton>
      </div>
    </div>
  )
}
