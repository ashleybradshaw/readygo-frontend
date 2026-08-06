import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { SettingsCloseButton } from '../components/settings/SettingsCloseButton'
import { showSuccessToast } from '../components/overlays/NotificationHost'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function DeleteDataPage() {
  const navigate = useNavigate()
  const savedRoutes = useReadyGoStore((state) => state.savedRoutes)
  const savedProfiles = useReadyGoStore((state) => state.savedProfiles)
  const clearAllData = useReadyGoStore((state) => state.clearAllData)

  return (
    <div className="flex h-full flex-col bg-[#DCE4E2] px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase leading-8 tracking-[-0.02em] text-[#0F1918]">
            Account
          </h1>
          <p className="mt-1 font-sans text-lg font-bold uppercase tracking-[-0.01em] text-[#0F1918]">
            Delete All My Data?
          </p>
        </div>
        <SettingsCloseButton onClick={() => navigate('/settings')} />
      </div>

      <p className="mb-3 font-sans text-sm font-bold text-[#0F1918]">How it works</p>
      <div className="space-y-2">
        <div className="rounded-[12px] bg-[#F4F8F7] px-4 py-3.5 font-sans text-base font-bold tracking-[-0.01em] text-[#0F1918]">
          [{savedRoutes.length}]/20 – Saved Routes
        </div>
        <div className="rounded-[12px] bg-[#F4F8F7] px-4 py-3.5 font-sans text-base font-bold tracking-[-0.01em] text-[#0F1918]">
          [{savedProfiles.length}]/5 – Saved Profiles
        </div>
      </div>

      <p className="mt-6 font-sans text-sm font-bold uppercase leading-5 tracking-[-0.01em] text-[#0F1918]">
        This will permanently delete your saved routes and profiles. Your account
        will remain active.
      </p>

      <div className="mt-auto">
        <PressableButton
          variant="cta"
          style={{ backgroundColor: '#BC9C75', color: '#0F1918' }}
          className="active:opacity-90"
          onClick={() => {
            clearAllData()
            showSuccessToast('Data cleared', 'Saved routes and profiles are gone.')
            navigate('/')
          }}
        >
          Delete all my data
        </PressableButton>
      </div>
    </div>
  )
}
