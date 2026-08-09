import { BottomSheet } from '../ui/BottomSheet'
import { ClosePillButton } from '../ui/ClosePillButton'

interface SessionMenuModalProps {
  open: boolean
  onClose: () => void
  onShareMap: () => void
  onSaveSession: () => void
  onCancelSession: () => void
}

export function SessionMenuModal({
  open,
  onClose,
  onShareMap,
  onSaveSession,
  onCancelSession,
}: SessionMenuModalProps) {
  return (
    <BottomSheet open={open} onClose={onClose} tone="dark">
      <div className="flex flex-col gap-4 pb-2 pt-1 text-[#BACBC9]">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.02em]">
            Session
          </h2>
          <ClosePillButton onClick={onClose} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            tabIndex={0}
            aria-label="Share map"
            onClick={onShareMap}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onShareMap()
              }
            }}
            className="h-8 rounded-full bg-[#BACBC9] px-3 text-xs font-medium text-[#0F1918]"
          >
            Share map
          </button>
          <button
            type="button"
            tabIndex={0}
            aria-label="Save session"
            onClick={onSaveSession}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSaveSession()
              }
            }}
            className="h-8 rounded-full bg-[#BACBC9] px-3 text-xs font-medium text-[#0F1918]"
          >
            Save session
          </button>
        </div>

        <button
          type="button"
          tabIndex={0}
          aria-label="Cancel session"
          onClick={onCancelSession}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onCancelSession()
            }
          }}
          className="h-8 w-full rounded-full bg-[#3B0000] px-3 text-xs font-medium text-[#FF3B30]"
        >
          Cancel session
        </button>
      </div>
    </BottomSheet>
  )
}
