import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { PaginationDots } from '../components/ui/PaginationDots'
import { TermsSheet } from '../components/onboarding/TermsSheet'
import { useReadyGoStore } from '../store/useReadyGoStore'

const slides = [
  {
    id: 'ready',
    hero: 'READY',
    heroClass: 'text-rg-red-cta',
    title: 'What is ReadyGo',
    subtitle: 'Your session, sorted.',
    body: [
      "ReadyGo is a pre-activity planning app for runners and cyclists. Open it when you've got time to move but not the headspace to plan.",
      'Tap Ready. Get a route, weather read, and kit suggestion – built around how you actually ride or run. Then go.',
    ],
    cta: 'Continue',
  },
  {
    id: 'set',
    hero: 'SET',
    heroClass: 'text-rg-text',
    title: 'Location access',
    subtitle: 'Why we need to know.',
    body: [
      'ReadyGo uses your location to build routes that actually start where you are. Not somewhere nearby. Right here.',
      "Not a fan of sharing location? No bother – you can set a home postcode in your profile instead.",
    ],
    cta: 'Open location settings',
  },
  {
    id: 'go',
    hero: 'GO',
    heroClass: 'text-[#7CFF00]',
    title: 'Setting up',
    subtitle: 'Profile & session setup.',
    body: [
      'Next up, a few quick questions about how you like to train – when, where, in what weather, at what pace.',
      'Answer once. ReadyGo remembers. Every session after that starts from where you left off.',
    ],
    cta: 'Get Started',
  },
] as const

export function IntroPage() {
  const navigate = useNavigate()
  const setHasSeenIntro = useReadyGoStore((state) => state.setHasSeenIntro)
  const isAuthenticated = useReadyGoStore((state) => state.isAuthenticated)
  const [index, setIndex] = useState(0)
  const [termsOpen, setTermsOpen] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  const slide = slides[index]
  const progressLabel = useMemo(() => `${index + 1} of ${slides.length}`, [index])

  const goNext = () => {
    if (index < slides.length - 1) {
      setIndex((current) => current + 1)
      return
    }
    setTermsOpen(true)
  }

  const skip = () => {
    setHasSeenIntro(true)
    navigate(isAuthenticated ? '/' : '/auth/create')
  }

  const requestLocation = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => goNext(),
        () => goNext(),
        { timeout: 4000 },
      )
      return
    }
    goNext()
  }

  const handlePrimary = () => {
    if (slide.id === 'set') {
      void requestLocation()
      return
    }
    if (slide.id === 'go') {
      setTermsOpen(true)
      return
    }
    goNext()
  }

  return (
    <div className="relative flex h-full flex-col bg-rg-base-alt px-5 pb-6 pt-10">
      <p className="sr-only">{progressLabel}</p>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={dragOffset}>
          <motion.div
            key={slide.id}
            custom={dragOffset}
            initial={{ x: dragOffset >= 0 ? 80 : -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dragOffset >= 0 ? -80 : 80, opacity: 0 }}
            transition={{ duration: 0.28 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) {
                setDragOffset(1)
                if (index < slides.length - 1) setIndex((current) => current + 1)
              } else if (info.offset.x > 80) {
                setDragOffset(-1)
                if (index > 0) setIndex((current) => current - 1)
              }
            }}
            className="flex h-full flex-col"
          >
            <div className="flex min-h-[180px] items-center justify-center rounded-[18px] bg-[radial-gradient(circle_at_top,#1c2a33_0%,#0f191b_70%)]">
              <h1
                className={`font-display text-6xl font-bold tracking-tight uppercase ${slide.heroClass}`}
              >
                {slide.hero}
              </h1>
            </div>

            <div className="mt-8 flex flex-col gap-2">
              <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-rg-text">
                {slide.title}
              </h2>
              <p className="text-lg font-bold uppercase tracking-[-0.01em] text-rg-text-muted">
                {slide.subtitle}
              </p>
              <div className="mt-3 flex flex-col gap-3 text-sm leading-5 text-rg-text-muted">
                {slide.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <PaginationDots count={slides.length} activeIndex={index} />
        <PressableButton onClick={handlePrimary}>{slide.cta}</PressableButton>
        {slide.id === 'go' ? (
          <button
            type="button"
            onClick={() => setTermsOpen(true)}
            className="text-center text-sm font-bold text-rg-text-muted underline underline-offset-2"
          >
            By clicking Get Started, you agree to our Terms of Service.
          </button>
        ) : (
          <button
            type="button"
            onClick={skip}
            className="text-base font-bold text-rg-text underline underline-offset-2"
          >
            Skip
          </button>
        )}
      </div>

      <TermsSheet
        open={termsOpen}
        onDecline={() => setTermsOpen(false)}
        onAccept={() => {
          setTermsOpen(false)
          setHasSeenIntro(true)
          navigate(isAuthenticated ? '/' : '/auth/create')
        }}
      />
    </div>
  )
}
