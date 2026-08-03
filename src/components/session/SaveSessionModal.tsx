import { Check } from 'lucide-react'
import { BottomSheet } from '../ui/BottomSheet'
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
    <BottomSheet open={open} onClose={onClose} tone="light">
      <div className="flex flex-col items-center gap-4 pt-2 pb-2 text-center">
        <div className="w-full rounded-[18px] bg-rg-base-alt px-5 py-8 text-rg-text">
          <div className="mx-auto flex size-[60px] items-center justify-center rounded-[14px] bg-[#7CFF00] text-rg-text-on-accent">
            <Check size={28} strokeWidth={3} />
          </div>
          <h2 className="mt-5 font-display text-2xl font-bold uppercase">
            Session saved
          </h2>
          <p className="mt-2 text-sm text-rg-text-muted">
            Load up this session anytime. Go to your saved sessions tab to view.
          </p>
        </div>

        <PressableButton variant="sheet" onClick={onBasecamp}>
          Basecamp
        </PressableButton>
      </div>
    </BottomSheet>
  )
}
