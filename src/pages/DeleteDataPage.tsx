import { useNavigate } from 'react-router-dom'
import { ClosePillButton } from '../components/ui/ClosePillButton'
import { PressableButton } from '../components/ui/PressableButton'
import { showSuccessToast } from '../components/overlays/NotificationHost'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function DeleteDataPage() {
  const navigate = useNavigate()
  const savedRoutes = useReadyGoStore((state) => state.savedRoutes)
  const savedProfiles = useReadyGoStore((state) => state.savedProfiles)
  const clearAllData = useReadyGoStore((state) => state.clearAllData)

  return (
    <div className="flex h-full flex-col bg-[#0F1918] px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase leading-8 tracking-[-0.02em] text-[#BACBC9]">
            Account
          </h1>
          <p className="mt-1 font-sans text-lg font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
            Delete All My Data?
          </p>
        </div>
        <ClosePillButton onClick={() => navigate('/settings')} />
      </div>

      <p className="mb-3 font-sans text-sm font-bold text-[#BACBC9]">
        How it works
      </p>
      <div className="space-y-2">
        <div className="rounded-[4px] bg-[#182629] px-4 py-3.5 font-sans text-base font-bold tracking-[-0.01em] text-[#BACBC9]">
          [{savedRoutes.length}]/20 – Saved Routes
        </div>
        <div className="rounded-[4px] bg-[#182629] px-4 py-3.5 font-sans text-base font-bold tracking-[-0.01em] text-[#BACBC9]">
          [{savedProfiles.length}]/5 – Saved Profiles
        </div>
      </div>

      <p className="mt-6 font-sans text-sm font-bold uppercase leading-5 tracking-[-0.01em] text-[#BACBC9]">
        This will permanently delete your saved routes and profiles. Your account
        will remain active.
      </p>

      <div className="mt-auto">
        <PressableButton
          onClick={() => {
            clearAllData()
            showSuccessToast('Data cleared', 'Saved routes and profiles are gone.')
            navigate('/settings', { replace: true })
          }}
          className="rounded-[4px] border-0"
          style={{
            height: 52,
            borderRadius: 4,
            backgroundColor: '#C5A059',
            color: '#0F1918',
            fontWeight: 700,
          }}
        >
          Delete all my data
        </PressableButton>
      </div>
    </div>
  )
}
