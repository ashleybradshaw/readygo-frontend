import { BottomSheet } from '../ui/BottomSheet'
import { SettingsCloseButton } from '../settings/SettingsCloseButton'

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
    <BottomSheet open={open} onClose={onClose} tone="light">
      <div className="flex flex-col gap-4 pb-2 pt-1 text-[#0F191B]">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.02em]">
            Session
          </h2>
          <SettingsCloseButton variant="onLight" onClick={onClose} />
        </div>

        <div className="rounded-[12px] border border-[#0F191B]/15 p-2">
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
              className="rounded-full bg-[#F5F7F7] px-3 py-3 text-sm font-bold tracking-[-0.01em] text-[#0F191B]"
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
              className="rounded-full bg-[#F5F7F7] px-3 py-3 text-sm font-bold tracking-[-0.01em] text-[#0F191B]"
            >
              Save session
            </button>
          </div>
        </div>

        <div className="rounded-[12px] border border-[#0F191B]/15 p-2">
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
            className="w-full rounded-full bg-[#F5F7F7] px-3 py-3 text-sm font-bold tracking-[-0.01em] text-[#0F191B]"
          >
            Cancel session
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
