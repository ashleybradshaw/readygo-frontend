import { XCircle } from 'lucide-react'

type LocationInfoSheetProps = {
  open: boolean
  onClose: () => void
}

export const LocationInfoSheet = ({ open, onClose }: LocationInfoSheetProps) => {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-5">
      <button
        type="button"
        aria-label="Dismiss location info"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onClose()
          }
        }}
        className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-access-title"
        className="relative z-10 w-full max-w-[340px] rounded-[16px] border border-[#2D3739] bg-[#182629] p-6 text-[#BACBC9] shadow-2xl"
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
          className="absolute top-4 right-4 cursor-pointer text-[#BACBC9]/60 hover:text-white"
        >
          <XCircle className="h-6 w-6" aria-hidden="true" />
        </button>

        <h3
          id="location-access-title"
          className="mb-3 pr-8 text-lg font-bold tracking-wide text-white uppercase"
        >
          Location Access
        </h3>
        <p className="mb-3 font-sans text-sm leading-relaxed text-[#BACBC9]">
          ReadyGo builds instant, hyper-local routes starting from your exact
          position. No extra search steps required.
        </p>
        <p className="font-sans text-sm leading-relaxed text-[#BACBC9]">
          Prefer not to share live GPS? No problem - you can set a home postcode
          in Settings anytime after creating your account.
        </p>
        <button
          type="button"
          tabIndex={0}
          aria-label="Got it"
          onClick={onClose}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onClose()
            }
          }}
          className="mt-4 h-11 w-full rounded-[4px] bg-[#D0E2DE] text-sm font-bold text-[#0F1918] transition-colors hover:bg-white"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
