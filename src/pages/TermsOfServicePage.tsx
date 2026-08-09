import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function TermsOfServicePage() {
  const navigate = useNavigate()
  const setHasAcceptedTerms = useReadyGoStore(
    (state) => state.setHasAcceptedTerms,
  )

  const handleDecline = () => {
    setHasAcceptedTerms(false)
    navigate('/welcome', { replace: true })
  }

  const handleAccept = () => {
    setHasAcceptedTerms(true)
    navigate('/auth/create')
  }

  return (
    <div className="relative flex h-full flex-col bg-[#0F1918] px-5 pb-8 pt-[max(3.5rem,env(safe-area-inset-top))]">
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-[#BACBC9]">
          Our Terms of Service
        </h1>
        <p className="mt-2 font-display text-sm font-bold uppercase tracking-[-0.01em] text-[#BACBC9]/80">
          Lorem ipsum dolor sit amet.
        </p>

        <div className="mt-6 space-y-4 font-sans text-sm leading-relaxed text-[#BACBC9]">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <p>
            ReadyGo uses your preferences and activity data to build better
            routes and session suggestions. By continuing, you agree that{' '}
            <span className="font-bold text-[#BACBC9]">
              We will market to you for the next 30 days – 4x
            </span>
            .
          </p>
          <p>
            You can update marketing preferences anytime in Settings after you
            create an account. Location data is only used to start routes where
            you are, and is never sold to third parties.
          </p>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <PressableButton
          onClick={handleDecline}
          className="rounded-[4px] border border-[#2D3739] bg-transparent"
          style={{
            height: 52,
            borderRadius: 4,
            backgroundColor: 'transparent',
            color: '#BACBC9',
            fontWeight: 700,
          }}
        >
          Decline
        </PressableButton>
        <PressableButton
          onClick={handleAccept}
          className="rounded-[4px] border-0"
          style={{
            height: 52,
            borderRadius: 4,
            backgroundColor: '#2D3739',
            color: '#FFFFFF',
            fontWeight: 700,
          }}
        >
          Accept
        </PressableButton>
      </div>
    </div>
  )
}
