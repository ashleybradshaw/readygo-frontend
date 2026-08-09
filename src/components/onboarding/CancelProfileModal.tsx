import { AnimatePresence, motion } from 'framer-motion'
import warningIcon from '../../assets/icons/Warning-1.todo.icon 1.svg'
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
              Cancel Setup?
            </h2>
            <p className="mt-2 max-w-[300px] font-sans text-base font-bold leading-5 tracking-[-0.01em] text-[#BACBC9]">
              Don&apos;t worry.
            </p>
            <p className="mt-1 max-w-[300px] font-sans text-base leading-5 tracking-[-0.01em] text-[#BACBC9]">
              You can always build custom run or cycle profiles later from
              Basecamp or Settings.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-3">
            <button
              type="button"
              tabIndex={0}
              aria-label="Keep Editing"
              onClick={onStay}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onStay()
                }
              }}
              className="px-5 py-2 font-sans text-base font-bold tracking-[-0.01em] text-[#BACBC9] underline underline-offset-2"
            >
              Keep Editing
            </button>
            <PressableButton
              variant="cta"
              onClick={onCancel}
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
}
