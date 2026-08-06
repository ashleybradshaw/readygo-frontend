import { AnimatePresence, motion } from 'framer-motion'
import { SuccessBadgeIcon } from '../overlays/OverlayBadges'
import { SettingsCloseButton } from '../settings/SettingsCloseButton'
import { PressableButton } from '../ui/PressableButton'

interface SuccessProfileOverlayProps {
  open: boolean
  onClose: () => void
  onBasecamp: () => void
}

export const SuccessProfileOverlay = ({
  open,
  onClose,
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
        <div className="flex justify-end">
          <SettingsCloseButton variant="onDark" onClick={onClose} />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <SuccessBadgeIcon size={60} />
          <h2
            id="success-profile-title"
            className="mt-5 font-display text-2xl font-bold uppercase leading-9 tracking-[-0.02em] text-[#BACBC9]"
          >
            Successful
          </h2>
          <p className="mt-1 max-w-[300px] font-sans text-base font-bold leading-5 tracking-[-0.01em] text-[#BACBC9]">
            Your new profile was saved!
          </p>
          <p className="mt-1 max-w-[300px] font-sans text-base leading-5 tracking-[-0.01em] text-[#BACBC9]">
            Update anytime in Settings.
          </p>
        </div>

        <div className="shrink-0">
          <PressableButton variant="cta" onClick={onBasecamp}>
            Basecamp
          </PressableButton>
        </div>
      </motion.div>
    ) : null}
  </AnimatePresence>
)
