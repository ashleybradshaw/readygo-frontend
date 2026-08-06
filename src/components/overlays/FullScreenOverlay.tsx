import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { PressableButton } from '../ui/PressableButton'

interface FullScreenOverlayProps {
  open: boolean
  icon: ReactNode
  heading: string
  bodyTitle?: string
  bodySub?: string
  primaryLabel?: string
  onPrimary?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  headingId?: string
}

export const FullScreenOverlay = ({
  open,
  icon,
  heading,
  bodyTitle,
  bodySub,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  headingId = 'fullscreen-overlay-heading',
}: FullScreenOverlayProps) => {
  const hasActions = Boolean(primaryLabel || secondaryLabel)

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-[80] flex flex-col bg-[#0F1918] px-5 pb-8"
        >
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            {icon}
            <h2
              id={headingId}
              className="mt-5 font-display text-2xl font-bold uppercase leading-9 tracking-[-0.02em] text-[#BACBC9]"
            >
              {heading}
            </h2>
            {bodyTitle ? (
              <p className="mt-1 max-w-[320px] font-sans text-base font-bold leading-5 tracking-[-0.01em] text-[#BACBC9]">
                {bodyTitle}
              </p>
            ) : null}
            {bodySub ? (
              <p className="mt-1 max-w-[320px] font-sans text-base leading-5 tracking-[-0.01em] text-[#BACBC9]">
                {bodySub}
              </p>
            ) : null}
          </div>

          {hasActions ? (
            <div className="flex shrink-0 flex-col items-center gap-1">
              {primaryLabel && onPrimary ? (
                <PressableButton variant="cta" onClick={onPrimary}>
                  {primaryLabel}
                </PressableButton>
              ) : null}
              {secondaryLabel && onSecondary ? (
                <button
                  type="button"
                  tabIndex={0}
                  aria-label={secondaryLabel}
                  onClick={onSecondary}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSecondary()
                    }
                  }}
                  className="px-5 py-5 font-sans text-base font-bold tracking-[-0.01em] text-[#BACBC9] underline underline-offset-2"
                >
                  {secondaryLabel}
                </button>
              ) : null}
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
