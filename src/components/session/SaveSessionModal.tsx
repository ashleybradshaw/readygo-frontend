import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { ClosePillButton } from '../ui/ClosePillButton'
import { PressableButton } from '../ui/PressableButton'

interface SaveSessionModalProps {
  open: boolean
  onBasecamp: () => void
  onClose: () => void
}

export function SaveSessionModal({
  open,
  onBasecamp,
  onClose,
}: SaveSessionModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col bg-[#0B1214] px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Session saved"
        >
          <div className="flex justify-end">
            <ClosePillButton onClick={onClose} />
          </div>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="flex size-16 items-center justify-center rounded-[12px] border border-[#4CAF00] bg-[#70FF00]">
              <Check size={36} strokeWidth={3} className="text-[#0F1918]" aria-hidden="true" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold uppercase tracking-[-0.02em] text-[#F5F7F7]">
              Session Saved
            </h2>
            <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-[#BACBC9]">
              Load up this session anytime.
              <br />
              Go to your saved sessions tab to view.
            </p>
          </div>

          <PressableButton
            onClick={onBasecamp}
            className="rounded-[4px] border-0"
            style={{
              height: 52,
              borderRadius: 4,
              backgroundColor: '#2D3739',
              color: '#F5F7F7',
              fontWeight: 700,
            }}
          >
            Basecamp
          </PressableButton>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
