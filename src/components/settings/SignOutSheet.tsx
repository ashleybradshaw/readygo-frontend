import { AlertTriangle } from 'lucide-react'
import { BottomSheet } from '../ui/BottomSheet'
import { PressableButton } from '../ui/PressableButton'

interface SignOutSheetProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function SignOutSheet({ open, onClose, onConfirm }: SignOutSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} tone="light">
      <div className="flex flex-col items-center gap-4 pt-2 pb-2 text-center">
        <div className="w-full rounded-[18px] bg-rg-base-alt px-5 py-8 text-rg-text">
          <div className="mx-auto flex size-[60px] items-center justify-center rounded-[14px] bg-rg-amber text-rg-text-on-accent">
            <AlertTriangle size={26} />
          </div>
          <h2 className="mt-5 font-display text-2xl font-bold uppercase">
            Sign out
          </h2>
          <p className="mt-2 text-base font-bold">
            Did you want to sign out of the app?
          </p>
          <p className="mt-1 text-sm text-rg-text-muted">
            Log back in whenever you&apos;re ready.
          </p>
        </div>
        <PressableButton variant="sheet" onClick={onConfirm}>
          Sign out
        </PressableButton>
      </div>
    </BottomSheet>
  )
}
