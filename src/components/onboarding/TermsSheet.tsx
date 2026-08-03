import { BottomSheet } from '../ui/BottomSheet'
import { PressableButton } from '../ui/PressableButton'
import { useReadyGoStore } from '../../store/useReadyGoStore'

interface TermsSheetProps {
  open: boolean
  onAccept: () => void
  onDecline: () => void
}

export function TermsSheet({ open, onAccept, onDecline }: TermsSheetProps) {
  const setHasAcceptedTerms = useReadyGoStore((state) => state.setHasAcceptedTerms)

  return (
    <BottomSheet open={open} onClose={onDecline} tone="dark">
      <div className="flex flex-col gap-4 pt-2">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-rg-text-muted">
            Our Terms of Service
          </h2>
          <p className="mt-1 text-lg font-bold uppercase text-rg-text-muted">
            The short version.
          </p>
        </div>

        <div className="max-h-[42vh] space-y-3 overflow-y-auto text-sm leading-5 text-rg-text-muted">
          <p>
            ReadyGo helps you organise sessions, routes, and kit. By using the app,
            you agree to keep your account details accurate and not misuse the
            service.
          </p>
          <p>
            Location and postcode data are used to build routes that start where
            you are. You can turn location off and use a home postcode instead.
          </p>
          <p>
            GOAI builds session suggestions from the preferences you set. You stay
            in control – edit or delete your data any time in Settings.
          </p>
          <p>
            We'll keep things direct. If something changes in these terms, we'll
            say so clearly in the app.
          </p>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-3">
          <PressableButton variant="danger" onClick={onDecline}>
            Decline
          </PressableButton>
          <PressableButton
            onClick={() => {
              setHasAcceptedTerms(true)
              onAccept()
            }}
          >
            Accept
          </PressableButton>
        </div>
      </div>
    </BottomSheet>
  )
}
