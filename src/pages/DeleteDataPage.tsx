import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { showSuccessToast } from '../components/overlays/NotificationHost'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function DeleteDataPage() {
  const navigate = useNavigate()
  const savedRoutes = useReadyGoStore((state) => state.savedRoutes)
  const savedProfiles = useReadyGoStore((state) => state.savedProfiles)
  const clearAllData = useReadyGoStore((state) => state.clearAllData)

  return (
    <div className="flex h-full flex-col bg-rg-base-alt px-5 pt-10 pb-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-rg-text">
          Account
        </h1>
        <p className="mt-1 text-lg font-bold uppercase text-rg-text-muted">
          Delete all my data?
        </p>
      </div>

      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-rg-text-muted">
        How it works
      </p>
      <div className="space-y-2">
        <div className="rounded-[12px] bg-rg-surface px-4 py-3 text-sm font-bold text-rg-text outline outline-1 outline-[#365466]">
          [{savedRoutes.length}]/20 – saved routes
        </div>
        <div className="rounded-[12px] bg-rg-surface px-4 py-3 text-sm font-bold text-rg-text outline outline-1 outline-[#365466]">
          [{savedProfiles.length}]/5 – saved profiles
        </div>
      </div>

      <p className="mt-6 text-sm font-bold uppercase leading-5 text-rg-text">
        This will permanently delete your saved routes and profiles. Your account
        will remain active.
      </p>

      <div className="mt-auto">
        <PressableButton
          className="bg-[#141210] text-rg-amber hover:bg-[#1C1812]"
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
