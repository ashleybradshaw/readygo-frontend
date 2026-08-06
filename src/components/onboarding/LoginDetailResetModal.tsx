import { AnimatePresence, motion } from 'framer-motion'
import { PressableButton } from '../ui/PressableButton'
import { SuccessCheckIcon } from '../ui/AuthIcons'

interface LoginDetailResetModalProps {
  open: boolean
  onSignIn: () => void
}

export function LoginDetailResetModal({
  open,
  onSignIn,
}: LoginDetailResetModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-detail-reset-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col bg-[#0F1918] px-5 pb-8"
        >
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <SuccessCheckIcon />
            <h2
              id="login-detail-reset-title"
              className="mt-5 font-display text-2xl font-bold uppercase leading-9 tracking-[-0.02em] text-[#BACBC9]"
            >
              Successful
            </h2>
            <p className="mt-1 font-sans text-base font-bold leading-5 tracking-[-0.01em] text-[#BACBC9]">
              Your login details have been updated.
            </p>
            <p className="mt-1 font-sans text-base leading-5 tracking-[-0.01em] text-[#BACBC9]">
              Sign in to pick up where you left off.
            </p>
          </div>

          <div className="shrink-0">
            <PressableButton variant="cta" onClick={onSignIn}>
              Sign in
            </PressableButton>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
