import { AnimatePresence, motion } from 'framer-motion'
import { PressableButton } from '../ui/PressableButton'
import { SettingsCloseButton } from './SettingsCloseButton'
import warningIcon from '../../assets/icons/Warning-1.todo.icon 1.svg'

interface SignOutSheetProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export const SignOutSheet = ({
  open,
  onClose,
  onConfirm,
}: SignOutSheetProps) => (
  <AnimatePresence>
    {open ? (
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sign-out-heading"
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
            id="sign-out-heading"
            className="mt-5 font-display text-2xl font-bold uppercase leading-9 tracking-[-0.02em] text-[#BACBC9]"
          >
            Sign out
          </h2>
          <p className="mt-1 max-w-[300px] font-sans text-base font-bold leading-5 tracking-[-0.01em] text-[#BACBC9]">
            Did you want to sign out of the app?
          </p>
          <p className="mt-1 max-w-[300px] font-sans text-base leading-5 tracking-[-0.01em] text-[#BACBC9]">
            Log back in whenever you&apos;re ready.
          </p>
        </div>

        <div className="shrink-0">
          <PressableButton variant="cta" onClick={onConfirm}>
            Sign out
          </PressableButton>
        </div>
      </motion.div>
    ) : null}
  </AnimatePresence>
)
