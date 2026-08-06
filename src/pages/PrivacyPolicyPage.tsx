import { useNavigate } from 'react-router-dom'
import { SettingsCloseButton } from '../components/settings/SettingsCloseButton'

export function PrivacyPolicyPage() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#DCE4E2] px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <h1 className="font-display text-2xl font-bold uppercase leading-8 tracking-[-0.02em] text-[#0F1918]">
          Privacy Policy
        </h1>
        <SettingsCloseButton onClick={() => navigate('/settings')} />
      </div>
      <div className="space-y-3 font-sans text-sm leading-5 tracking-[-0.01em] text-[#0F1918]">
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
