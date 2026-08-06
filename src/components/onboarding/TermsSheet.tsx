import { AnimatePresence, motion } from 'framer-motion'
import { PressableButton } from '../ui/PressableButton'
import { useReadyGoStore } from '../../store/useReadyGoStore'

interface TermsSheetProps {
  open: boolean
  onAccept: () => void
  onDecline: () => void
}

export function TermsSheet({ open, onAccept, onDecline }: TermsSheetProps) {
  const setHasAcceptedTerms = useReadyGoStore((state) => state.setHasAcceptedTerms)

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col bg-[#0F1918] px-5 pb-8 pt-[70px]"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
            <div className="flex flex-col gap-[5px] uppercase">
              <h2
                id="terms-title"
                className="font-display text-2xl font-bold leading-8 tracking-[-0.02em] text-[#BACBC9]"
              >
                Our Terms of Service
              </h2>
              <p className="font-sans text-lg font-bold leading-[26px] tracking-[-0.01em] text-[#BACBC9]">
                Lorem ipsum dolor sit amet.
              </p>
            </div>

            <div className="space-y-3 font-sans text-base leading-normal text-[#BACBC9]">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>
              <p>
                ReadyGo helps you organise sessions, routes, and kit. By using
                the app, you agree to keep your account details accurate and not
                misuse the service.{' '}
                <span className="font-bold">
                  We will market to you for the next 30 days – 4x
                </span>
                .
              </p>
              <p>
                Location and postcode data are used to build routes that start
                where you are. You can turn location off and use a home postcode
                instead. GOAI builds session suggestions from the preferences
                you set. You stay in control – edit or delete your data any time
                in Settings.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <PressableButton
              variant="ghost"
              onClick={onDecline}
              whileTap={{ scale: 1 }}
              className="!no-underline hover:!no-underline border border-[#39484A] bg-transparent text-[#BACBC9]"
              style={{ height: 52, borderRadius: 12, textDecoration: 'none' }}
            >
              Decline
            </PressableButton>
            <PressableButton
              variant="cta"
              onClick={() => {
                setHasAcceptedTerms(true)
                onAccept()
              }}
            >
              Accept
            </PressableButton>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
