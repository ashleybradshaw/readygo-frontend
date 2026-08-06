import { AnimatePresence, motion } from 'framer-motion'
import { PressableButton } from '../ui/PressableButton'
import { SuccessCheckIcon } from '../ui/AuthIcons'
import { pickFallbackName } from '../../lib/onboarding'

interface UserNameModalProps {
  open: boolean
  userName: string
  onPickAnother: () => void
  onBasecamp: () => void
  onClose?: () => void
}

export function UserNameModal({
  open,
  userName,
  onPickAnother,
  onBasecamp,
}: UserNameModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-name-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col bg-[#0F1918] px-5 pb-8 pt-[120px]"
        >
          <div className="flex flex-1 flex-col items-center text-center">
            <SuccessCheckIcon />
            <h2
              id="user-name-title"
              className="mt-5 font-display text-2xl font-bold uppercase leading-9 tracking-[-0.02em] text-[#BACBC9]"
            >
              Nice meeting you
            </h2>
            <p className="mt-1 font-sans text-base font-bold leading-5 tracking-[-0.01em] text-[#BACBC9]">
              {userName || '[User Name]'}
            </p>
            <p className="mt-1 font-sans text-base leading-5 tracking-[-0.01em] text-[#BACBC9]">
              Jump into Basecamp to continue.
            </p>
          </div>

          <div className="mt-auto flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={onPickAnother}
              className="px-5 py-5 font-sans text-base font-bold tracking-[-0.01em] text-[#BACBC9] underline underline-offset-2"
            >
              Pick another name
            </button>
            <PressableButton variant="cta" onClick={onBasecamp}>
              Basecamp
            </PressableButton>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export function cycleDisplayName(current: string) {
  return pickFallbackName(current)
}
