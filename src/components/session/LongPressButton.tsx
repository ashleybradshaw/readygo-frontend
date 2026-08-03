import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface LongPressButtonProps {
  label?: string
  holdMs?: number
  onComplete: () => void
}

export function LongPressButton({
  label = 'End Session (Hold)',
  holdMs = 1500,
  onComplete,
}: LongPressButtonProps) {
  const [progress, setProgress] = useState(0)
  const frameRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  const clear = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = null
    startRef.current = null
    setProgress(0)
  }

  const tick = (timestamp: number) => {
    if (startRef.current === null) startRef.current = timestamp
    const elapsed = timestamp - startRef.current
    const next = Math.min(1, elapsed / holdMs)
    setProgress(next)
    if (next >= 1) {
      clear()
      onComplete()
      return
    }
    frameRef.current = requestAnimationFrame(tick)
  }

  const start = () => {
    clear()
    frameRef.current = requestAnimationFrame(tick)
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onPointerDown={start}
      onPointerUp={clear}
      onPointerLeave={clear}
      onPointerCancel={clear}
      className="relative overflow-hidden rounded-full bg-rg-base-alt/90 px-5 py-3 text-sm font-bold text-rg-text outline outline-1 outline-white/15 backdrop-blur"
    >
      <span
        className="absolute inset-y-0 left-0 bg-rg-red-cta/70"
        style={{ width: `${progress * 100}%` }}
      />
      <span className="relative">{label}</span>
    </motion.button>
  )
}
