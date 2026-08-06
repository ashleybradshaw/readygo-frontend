import { AnimatePresence, motion } from 'framer-motion'
import warningIcon from '../../assets/icons/Warning-1.todo.icon 1.svg'
import { SettingsCloseButton } from '../settings/SettingsCloseButton'
import { PressableButton } from '../ui/PressableButton'

interface CancelProfileModalProps {
  open: boolean
  onStay: () => void
  onCancel: () => void
}

export function CancelProfileModal({
  open,
  onStay,
  onCancel,
}: CancelProfileModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-profile-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-[80] flex flex-col bg-[#0F1918] px-5 pb-8 pt-[65px]"
        >
          <div className="flex justify-end">
            <SettingsCloseButton variant="onDark" onClick={onStay} />
          </div>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <img
              src={warningIcon}
              alt=""
              width={60}
              height={60}
              className="size-[60px] object-contain"
              draggable={false}
              aria-hidden="true"
            />
            <h2
              id="cancel-profile-title"
              className="mt-5 font-display text-2xl font-bold uppercase leading-9 tracking-[-0.02em] text-[#BACBC9]"
            >
              Cancel Profile
            </h2>
            <p className="mt-1 max-w-[300px] font-sans text-base font-bold leading-5 tracking-[-0.01em] text-[#BACBC9]">
              You can do this later.
            </p>
            <p className="mt-1 max-w-[300px] font-sans text-base leading-5 tracking-[-0.01em] text-[#BACBC9]">
              Set up your profile from Basecamp whenever you&apos;re ready.
            </p>
          </div>

          <div className="shrink-0">
            <PressableButton variant="cta" onClick={onCancel}>
              Basecamp
            </PressableButton>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
