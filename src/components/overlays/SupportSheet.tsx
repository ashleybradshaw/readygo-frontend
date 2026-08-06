import { BottomSheet } from '../ui/BottomSheet'
import { PressableButton } from '../ui/PressableButton'

interface SupportSheetProps {
  open: boolean
  onClose: () => void
}

export const SupportSheet = ({ open, onClose }: SupportSheetProps) => (
  <BottomSheet open={open} onClose={onClose} tone="dark">
    <div className="flex flex-col items-center gap-4 pt-2 pb-2 text-center">
      <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-[#BACBC9]">
        Need help?
      </h2>
      <p className="max-w-[300px] font-sans text-base leading-5 tracking-[-0.01em] text-[#BACBC9]">
        If something keeps going wrong, close the app and reopen it. Still stuck?
        Email us at support@readygo.app and we&apos;ll sort it.
      </p>
      <PressableButton variant="cta" onClick={onClose}>
        Got it
      </PressableButton>
    </div>
  </BottomSheet>
)
