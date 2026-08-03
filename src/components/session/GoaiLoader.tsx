import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const STATUS_LINES = [
  'Building your session...',
  'Checking conditions...',
  'Plotting your route...',
]

interface GoaiLoaderProps {
  open: boolean
  statusLines?: string[]
  intervalMs?: number
}

export function GoaiLoader({
  open,
  statusLines = STATUS_LINES,
  intervalMs = 900,
}: GoaiLoaderProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!open) {
      setIndex(0)
      return
    }
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % statusLines.length)
    }, intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs, open, statusLines.length])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-rg-base-alt"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(255,59,48,0.25),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(ellipse_at_bottom,rgba(124,255,0,0.2),transparent_70%)]" />

          <div className="mb-10 flex items-center font-display text-3xl font-semibold tracking-tight text-rg-text-muted uppercase">
            <span>Ready</span>
            <span className="relative mx-1 inline-flex h-8 w-8 items-center justify-center">
              <span className="absolute h-[3px] w-7 rotate-[-28deg] rounded-full bg-rg-red" />
              <span className="absolute h-[3px] w-7 translate-y-[6px] rotate-[-28deg] rounded-full bg-rg-amber" />
              <span className="absolute h-[3px] w-7 translate-y-[12px] rotate-[-28deg] rounded-full bg-[#7CFF00]" />
            </span>
            <span>Go</span>
          </div>

          <div className="flex items-center gap-3">
            <DotRow colour="bg-rg-red" delay={0} />
            <div className="flex items-center gap-2 rounded-full bg-rg-surface px-3 py-2">
              <motion.div
                className="size-5 overflow-hidden rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
              >
                <div className="h-full w-1/2 bg-rg-amber" />
                <div className="ml-auto h-full w-1/2 bg-[#7CFF00]" />
              </motion.div>
              <span className="text-sm font-bold tracking-wide text-rg-text uppercase">
                GOAI
              </span>
            </div>
            <DotRow colour="bg-[#7CFF00]" delay={0.15} />
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={statusLines[index]}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-8 text-sm font-bold text-rg-text-muted"
            >
              {statusLines[index]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function DotRow({ colour, delay }: { colour: string; delay: number }) {
  return (
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
}
