import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { PaginationDots } from '../components/ui/PaginationDots'
import { TermsSheet } from '../components/onboarding/TermsSheet'
import { useReadyGoStore } from '../store/useReadyGoStore'
import intro2 from '../assets/intro/intro-2.jpg'
import intro3 from '../assets/intro/intro-3.jpg'

const INTRO_1_IMAGE = '/images/intro/intro-1.png'

const slides = [
  {
    id: 'ready',
    hero: 'READY',
    heroColor: '#FF3B30',
    image: INTRO_1_IMAGE,
    /** Align to image top so heads stay fully visible in the 45% hero frame */
    objectPosition: 'object-top',
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
    heroColor: '#BACBC9',
    image: intro2,
    objectPosition: 'object-center',
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
    heroColor: '#70FF00',
    image: intro3,
    objectPosition: 'object-[center_30%]',
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

  const slide = slides[index]
  const progressLabel = useMemo(
    () => `${index + 1} of ${slides.length}`,
    [index],
  )

  const goToIndex = (next: number) => {
    if (next < 0 || next >= slides.length || next === index) return
    setIndex(next)
  }

  const goNext = () => {
    if (index < slides.length - 1) {
      goToIndex(index + 1)
      return
    }
    setTermsOpen(true)
  }

  const skip = () => {
    setHasSeenIntro(true)
    navigate(isAuthenticated ? '/' : '/welcome')
  }

  const handlePrimary = () => {
    if (slide.id === 'set') {
      // Prototype: advance to slide 3 without blocking on system settings
      goToIndex(2)
      return
    }
    if (slide.id === 'go') {
      setTermsOpen(true)
      return
    }
    goNext()
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#0F1918]">
      <p className="sr-only">{progressLabel}</p>

      <div
        className="flex min-h-0 flex-1 flex-col"
        style={{ touchAction: 'pan-y' }}
      >
        <motion.div
          className="flex min-h-0 flex-1 flex-col"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_, info) => {
            if (info.offset.x < -64 || info.velocity.x < -400) {
              goToIndex(index + 1)
            } else if (info.offset.x > 64 || info.velocity.x > 400) {
              goToIndex(index - 1)
            }
          }}
        >
          {/* TOP HERO — 45% */}
          <div className="relative h-[45%] min-h-0 w-full shrink-0 overflow-hidden">
            <AnimatePresence mode="sync" initial={false}>
              <motion.img
                key={`img-${slide.id}`}
                src={slide.image}
                alt=""
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className={`absolute inset-0 h-full w-full object-cover ${slide.objectPosition}`}
                draggable={false}
              />
            </AnimatePresence>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-40"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 42%, rgba(186,203,201,0.9) 0%, rgba(54,84,102,0.55) 76%)',
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F1918]/50" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.h1
                  key={`hero-${slide.id}`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-center text-2xl font-bold uppercase leading-8 tracking-[-0.02em]"
                  style={{ color: slide.heroColor }}
                >
                  {slide.hero}
                </motion.h1>
              </AnimatePresence>
            </div>
          </div>

          {/* MIDDLE COPY — opacity fade */}
          <div className="relative min-h-0 flex-1 overflow-hidden px-5 pt-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`copy-${slide.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className="flex h-full flex-col gap-2.5"
              >
                <div className="flex flex-col gap-[5px]">
                  <h2 className="font-display text-2xl font-bold uppercase leading-8 tracking-[-0.02em] text-[#BACBC9]">
                    {slide.title}
                  </h2>
                  <p className="font-sans text-lg font-bold uppercase leading-[26px] tracking-[-0.01em] text-[#BACBC9]">
                    {slide.subtitle}
                  </p>
                </div>
                <div className="mt-0 flex flex-col gap-2.5 font-sans text-base leading-normal text-[#BACBC9]">
                  {slide.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* FIXED BOTTOM CONTROLS */}
      <div className="flex shrink-0 flex-col items-center gap-4 px-5 pb-[30px] pt-3">
        <PaginationDots
          count={slides.length}
          activeIndex={index}
          activeWidth={28}
          inactiveColor="#4F6163"
          onDotClick={goToIndex}
        />

        <PressableButton
          onClick={handlePrimary}
          variant="ghost"
          whileTap={{ scale: 1 }}
          className="!no-underline hover:!no-underline active:bg-[#1E2729]"
          style={{
            height: 52,
            borderRadius: 12,
            backgroundColor: '#2D3739',
            color: '#BACBC9',
            textDecoration: 'none',
          }}
          aria-label={slide.cta}
        >
          {slide.cta}
        </PressableButton>
        <button
          type="button"
          onClick={skip}
          className="font-sans text-base font-bold leading-6 tracking-[-0.01em] text-[#BACBC9] underline underline-offset-2"
        >
          Skip
        </button>
      </div>

      <TermsSheet
        open={termsOpen}
        onDecline={() => setTermsOpen(false)}
        onAccept={() => {
          setTermsOpen(false)
          setHasSeenIntro(true)
          navigate(isAuthenticated ? '/' : '/welcome')
        }}
      />
    </div>
  )
}
