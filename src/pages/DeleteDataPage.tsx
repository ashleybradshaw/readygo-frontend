import { useNavigate } from 'react-router-dom'
import { ArrowLeftCircle } from 'lucide-react'
import { PressableButton } from '../components/ui/PressableButton'
import { showSuccessToast } from '../components/overlays/NotificationHost'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function DeleteDataPage() {
  const navigate = useNavigate()
  const savedRoutes = useReadyGoStore((state) => state.savedRoutes)
  const savedProfiles = useReadyGoStore((state) => state.savedProfiles)
  const clearAllData = useReadyGoStore((state) => state.clearAllData)

  const handleBack = () => {
    navigate('/settings')
  }

  return (
    <div className="relative flex h-full flex-col bg-[#0F1918] px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-8">
      <button
        type="button"
        tabIndex={0}
        aria-label="Back to settings"
        onClick={handleBack}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleBack()
          }
        }}
        className="absolute top-6 right-6 z-20 cursor-pointer text-[#BACBC9] hover:text-white"
      >
        <ArrowLeftCircle className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="mb-6 pr-10">
        <h2 className="text-xl font-black tracking-wide text-white uppercase">
          ACCOUNT
        </h2>
        <p className="mt-1 text-xs font-bold text-[#BACBC9] uppercase">
          DELETE ALL MY DATA?
        </p>
      </div>

      <p className="mb-3 font-sans text-sm font-bold text-[#BACBC9]">
        How it works
      </p>
      <p className="mb-4 font-sans text-sm leading-5 tracking-[-0.01em] text-[#BACBC9]/80">
        This will permanently delete your saved routes and profiles. Your account
        will remain active.
      </p>
      <div className="space-y-2">
        <div className="rounded-[4px] bg-[#182629] px-4 py-3.5 font-sans text-base font-bold tracking-[-0.01em] text-[#BACBC9]">
          {savedRoutes.length} / 20 Saved Routes
        </div>
        <div className="rounded-[4px] bg-[#182629] px-4 py-3.5 font-sans text-base font-bold tracking-[-0.01em] text-[#BACBC9]">
          {savedProfiles.length} / 5 Saved Profiles
        </div>
      </div>

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
