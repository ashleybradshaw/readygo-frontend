import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ReadyGoWordmark } from './BasecampIcons'
import { DotMatrixLoader } from './DotMatrixLoader'

const DEFAULT_ADVANCE_MS = 1500
const EXIT_MS = 280

type GlobalLoadingScreenProps = {
  ariaLabel?: string
  /** Full-page mode: auto-advance after delay (and on tap). */
  onAdvance?: () => void
  enabled?: boolean
  advanceMs?: number
  /** Overlay mode: controlled visibility without auto-navigation. */
  open?: boolean
  overlay?: boolean
}

export const GlobalLoadingScreen = ({
  ariaLabel = 'Loading',
  onAdvance,
  enabled = true,
  advanceMs = DEFAULT_ADVANCE_MS,
  open = true,
  overlay = false,
}: GlobalLoadingScreenProps) => {
  const [exiting, setExiting] = useState(false)
  const advancedRef = useRef(false)
  const exitTimerRef = useRef<number | null>(null)

  const handleAdvance = () => {
    if (!onAdvance || !enabled || advancedRef.current || exiting) return
    setExiting(true)
    exitTimerRef.current = window.setTimeout(() => {
      if (advancedRef.current) return
      advancedRef.current = true
      onAdvance()
    }, EXIT_MS)
  }

  useEffect(() => {
    if (!onAdvance || !enabled || !open) return

    const timer = window.setTimeout(() => {
      handleAdvance()
    }, advanceMs)

    return () => {
      window.clearTimeout(timer)
      if (exitTimerRef.current != null) {
        window.clearTimeout(exitTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- advance once when enabled
  }, [enabled, advanceMs, onAdvance, open])

  const content = (
    <div className="relative z-10 flex flex-col items-center gap-10 px-8">
      <ReadyGoWordmark />
      <div className="flex items-center gap-3" aria-hidden="true">
        <DotRow colour="bg-[#FF3B30]" delay={0} />
        <DotMatrixLoader size={49} dotSize={6} />
        <DotRow colour="bg-[#70FF00]" delay={0.15} />
      </div>
    </div>
  )

  if (overlay) {
    return (
      <AnimatePresence>
        {open ? (
          <motion.div
            role="status"
            aria-label={ariaLabel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0F1918]"
          >
            {content}
          </motion.div>
        ) : null}
      </AnimatePresence>
    )
  }

  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      tabIndex={0}
      onClick={handleAdvance}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleAdvance()
        }
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.28, ease: 'easeInOut' }}
      className="relative flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden border-0 bg-[#0F1918] p-0 text-left outline-none"
    >
      {content}
    </motion.button>
  )
}

const DotRow = ({ colour, delay }: { colour: string; delay: number }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: 4 }).map((_, index) => (
      <motion.span
        key={index}
        className={`size-2 rounded-full ${colour}`}
        animate={{ opacity: [0.25, 1, 0.25] }}
        transition={{
          duration: 1.1,
          repeat: Infinity,
          delay: delay + index * 0.12,
        }}
      />
    ))}
  </div>
)

/** @deprecated Prefer GlobalLoadingScreen */
export const GatheringLoaderScreen = GlobalLoadingScreen
