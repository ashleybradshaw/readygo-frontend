import { useState } from 'react'
import { BottomSheet } from '../ui/BottomSheet'
import { ClosePillButton } from '../ui/ClosePillButton'
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
    <BottomSheet open={open} onClose={onClose} tone="dark">
      <div className="flex flex-col gap-4 pb-2 pt-1 text-[#BACBC9]">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-xl font-bold uppercase tracking-[-0.02em]">
            Tell Us About An Issue
          </h2>
          <ClosePillButton onClick={onClose} />
        </div>
        <p className="text-sm text-[#BACBC9]/80">
          Share what went wrong and we&apos;ll look into it.
        </p>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-label="Issue details"
          placeholder="Describe the issue…"
          rows={5}
          className="w-full resize-none rounded-[4px] border border-[#2D3739] bg-[#182629] px-3 py-3 text-sm text-[#BACBC9] outline-none placeholder:text-[#BACBC9]/50 focus:border-[#BACBC9]/40"
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
    </BottomSheet>
  )
}
