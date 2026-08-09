import { useNavigate } from 'react-router-dom'
import { ClosePillButton } from '../components/ui/ClosePillButton'

export function PrivacyPolicyPage() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#0F1918] px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <h1 className="font-display text-2xl font-bold uppercase leading-8 tracking-[-0.02em] text-[#BACBC9]">
          Privacy Policy
        </h1>
        <ClosePillButton onClick={() => navigate('/settings')} />
      </div>
      <div className="space-y-3 font-sans text-sm leading-5 tracking-[-0.01em] text-[#BACBC9]">
        <p>
          ReadyGo uses your location or postcode to build routes that start where
          you are. You can turn location off anytime.
        </p>
        <p>
          GOAI stores the preferences you set so sessions stay organised. You can
          delete saved routes, profiles, or your whole account in Settings.
        </p>
        <p>
          We don&apos;t sell your data. Say less, keep it useful, keep it yours.
        </p>
      </div>
    </div>
  )
}
