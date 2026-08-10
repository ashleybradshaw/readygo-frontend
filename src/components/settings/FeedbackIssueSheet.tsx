import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import { PressableButton } from '../ui/PressableButton'
import { showSuccessToast } from '../overlays/NotificationHost'

interface FeedbackIssueSheetProps {
  open: boolean
  onClose: () => void
}

export const FeedbackIssueSheet = ({
  open,
  onClose,
}: FeedbackIssueSheetProps) => {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    const trimmed = message.trim()
    if (!trimmed) return
    showSuccessToast('Thanks', 'Your feedback was sent.')
    setMessage('')
    onClose()
  }

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/70 backdrop-blur-md">
          <motion.button
            type="button"
            aria-label="Dismiss"
            className="absolute inset-0 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="issue-sheet-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative z-[101] mx-auto w-full max-w-md rounded-t-[24px] border-t border-[#2D3739] bg-[#182629] p-6 text-[#BACBC9] shadow-2xl"
          >
            <button
              type="button"
              tabIndex={0}
              aria-label="Close"
              onClick={onClose}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onClose()
                }
              }}
              className="absolute top-6 right-6 z-[102] cursor-pointer text-[#BACBC9]/60 hover:text-white"
            >
              <XCircle className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-col gap-4 pt-1 pr-8 pb-2">
              <h2
                id="issue-sheet-title"
                className="font-display text-xl font-bold tracking-[-0.02em] uppercase"
              >
                Tell Us About An Issue
              </h2>
              <p className="text-sm text-[#BACBC9]/80">
                Share what went wrong and we&apos;ll look into it.
              </p>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                aria-label="Issue details"
                placeholder="Describe the issue…"
                rows={5}
                className="w-full resize-none rounded-[4px] border border-[#2D3739] bg-[#0F1918] px-3 py-3 text-sm text-[#BACBC9] outline-none placeholder:text-[#BACBC9]/50 focus:border-[#BACBC9]/40"
              />
              <PressableButton
                onClick={handleSubmit}
                disabled={!message.trim()}
                className="rounded-[4px] border-0"
                style={{
                  height: 52,
                  borderRadius: 4,
                  backgroundColor: '#C5A059',
                  color: '#0F1918',
                  fontWeight: 700,
                }}
              >
                Send feedback
              </PressableButton>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
