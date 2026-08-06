import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ReadyGoWordmark } from '../ui/BasecampIcons'
import { DotMatrixLoader } from '../ui/DotMatrixLoader'

const ADVANCE_MS = 2000
const EXIT_MS = 280

type GatheringLoaderScreenProps = {
  ariaLabel: string
  onAdvance: () => void
  enabled?: boolean
}

export const GatheringLoaderScreen = ({
  ariaLabel,
  onAdvance,
  enabled = true,
}: GatheringLoaderScreenProps) => {
  const [exiting, setExiting] = useState(false)
  const advancedRef = useRef(false)
  const exitTimerRef = useRef<number | null>(null)

  const handleAdvance = () => {
    if (!enabled || advancedRef.current || exiting) return
    setExiting(true)
    exitTimerRef.current = window.setTimeout(() => {
      if (advancedRef.current) return
      advancedRef.current = true
      onAdvance()
    }, EXIT_MS)
  }

  useEffect(() => {
    if (!enabled) return

    const timer = window.setTimeout(() => {
      handleAdvance()
    }, ADVANCE_MS)

    return () => {
      window.clearTimeout(timer)
      if (exitTimerRef.current != null) {
        window.clearTimeout(exitTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- advance once when enabled
  }, [enabled])

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
      <div className="relative z-10 flex flex-col items-center gap-10 px-8">
        <ReadyGoWordmark />

        <div className="flex items-center gap-3" aria-hidden="true">
          <DotRow colour="bg-[#FF3B30]" delay={0} />
          <DotMatrixLoader size={49} dotSize={6} />
          <DotRow colour="bg-[#70FF00]" delay={0.15} />
        </div>
      </div>
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
