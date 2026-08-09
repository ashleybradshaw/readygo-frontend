import { AnimatePresence, motion } from 'framer-motion'
import { SuccessBadgeIcon } from '../overlays/OverlayBadges'
import { PressableButton } from '../ui/PressableButton'

interface SuccessProfileOverlayProps {
  open: boolean
  onMakeAnother: () => void
  onBasecamp: () => void
}

export const SuccessProfileOverlay = ({
  open,
  onMakeAnother,
  onBasecamp,
}: SuccessProfileOverlayProps) => (
  <AnimatePresence>
    {open ? (
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-profile-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-[80] flex flex-col bg-[#0F1918] px-5 pb-8 pt-[65px]"
      >
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <SuccessBadgeIcon size={60} />
          <h2
            id="success-profile-title"
            className="mt-5 font-display text-2xl font-bold uppercase leading-9 tracking-[-0.02em] text-[#BACBC9]"
          >
            Profile Saved!
          </h2>
          <p className="mt-2 max-w-[300px] font-sans text-base font-bold leading-5 tracking-[-0.01em] text-[#BACBC9]">
            Your new profile is live.
          </p>
          <p className="mt-1 max-w-[300px] font-sans text-base leading-5 tracking-[-0.01em] text-[#BACBC9]">
            We&apos;ll use these rules whenever this profile is active.
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-3">
          <button
            type="button"
            tabIndex={0}
            aria-label="Make another one?"
            onClick={onMakeAnother}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onMakeAnother()
              }
            }}
            className="px-5 py-2 font-sans text-base font-bold tracking-[-0.01em] text-[#BACBC9] underline underline-offset-2"
          >
            Make another one?
          </button>
          <PressableButton
            variant="cta"
            onClick={onBasecamp}
            className="rounded-[4px]"
            style={{ borderRadius: 4 }}
          >
            Basecamp
          </PressableButton>
        </div>
      </motion.div>
    ) : null}
  </AnimatePresence>
)
