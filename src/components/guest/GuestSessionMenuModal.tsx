import { BottomSheet } from '../ui/BottomSheet'
import { SettingsCloseButton } from '../settings/SettingsCloseButton'

interface GuestSessionMenuModalProps {
  open: boolean
  onClose: () => void
  onShareMap: () => void
  onCancelSession: () => void
}

export function GuestSessionMenuModal({
  open,
  onClose,
  onShareMap,
  onCancelSession,
}: GuestSessionMenuModalProps) {
  return (
    <BottomSheet open={open} onClose={onClose} tone="dark">
      <div className="flex flex-col gap-4 pb-2 pt-1 text-[#BACBC9]">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.02em]">
            Session
          </h2>
          <SettingsCloseButton variant="onDark" onClick={onClose} />
        </div>

        <div className="rounded-[12px] border border-[#BACBC9]/20 p-2">
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
              className="rounded-full bg-[#BACBC9] px-3 py-3 text-sm font-bold tracking-[-0.01em] text-[#0F1918]"
            >
              Share map
            </button>
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
              className="rounded-full bg-[#3B0000] px-3 py-3 text-sm font-bold tracking-[-0.01em] text-[#FF3B30]"
            >
              Cancel session
            </button>
          </div>
        </div>
      </div>
    </BottomSheet>
  )
}
