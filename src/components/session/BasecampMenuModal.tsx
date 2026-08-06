import { useNavigate } from 'react-router-dom'
import { BottomSheet } from '../ui/BottomSheet'
import { PressableButton } from '../ui/PressableButton'
import { SettingsCloseButton } from '../settings/SettingsCloseButton'
import { formatSessionHours } from '../../lib/session'
import { useReadyGoStore } from '../../store/useReadyGoStore'

interface BasecampMenuModalProps {
  open: boolean
  onClose: () => void
  onReady: () => void
}

export function BasecampMenuModal({
  open,
  onClose,
  onReady,
}: BasecampMenuModalProps) {
  const navigate = useNavigate()
  const hours = useReadyGoStore((state) => state.oneTimeSessionHours)
  const setHours = useReadyGoStore((state) => state.setOneTimeSessionHours)
  const currentProfile = useReadyGoStore((state) => state.currentProfile)
  const resetProfileDraft = useReadyGoStore((state) => state.resetProfileDraft)
  const startEditProfile = useReadyGoStore((state) => state.startEditProfile)
  const progress = ((hours - 1) / 4) * 100

  const handleCreateProfile = () => {
    resetProfileDraft()
    onClose()
    navigate('/setup')
  }

  const handleEditProfile = () => {
    if (currentProfile) {
      startEditProfile(currentProfile.id)
    }
    onClose()
    navigate('/setup')
  }

  return (
    <BottomSheet open={open} onClose={onClose} tone="light">
      <div className="flex flex-col gap-5 pb-2 pt-1 text-[#0F191B]">
        <div className="flex justify-end">
          <SettingsCloseButton variant="onLight" onClick={onClose} />
        </div>

        <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.02em]">
          Profile
        </h2>

        <div className="rounded-[12px] border border-[#0F191B]/15 p-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              tabIndex={0}
              aria-label="Create new profile"
              onClick={handleCreateProfile}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleCreateProfile()
                }
              }}
              className="rounded-full bg-[#F5F7F7] px-3 py-3 text-sm font-bold tracking-[-0.01em] text-[#0F191B]"
            >
              Create new profile
            </button>
            <button
              type="button"
              tabIndex={0}
              aria-label="Edit current profile"
              onClick={handleEditProfile}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleEditProfile()
                }
              }}
              className="rounded-full bg-[#F5F7F7] px-3 py-3 text-sm font-bold tracking-[-0.01em] text-[#0F191B]"
            >
              Edit current profile
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-display text-2xl font-bold uppercase tracking-[-0.02em]">
            Session
          </h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#0F191B]/70">
            Set a one time session length (Beta)
          </p>

          <div className="mt-3 rounded-[14px] bg-[#0F191B]/10 px-4 py-5">
            <input
              type="range"
              min={1}
              max={5}
              step={0.5}
              value={hours}
              onChange={(event) => setHours(Number(event.target.value))}
              className="session-length-slider w-full"
              style={{ ['--session-progress' as string]: `${progress}%` }}
              aria-label="Session length"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="rounded-full bg-[#F5F7F7] px-3 py-1 text-xs font-bold text-[#0F191B]">
                Min [1 hr]
              </span>
              <span className="rounded-full bg-[#0F191B] px-3 py-1 text-xs font-bold text-[#70FF00]">
                {formatSessionHours(hours)}
              </span>
            </div>
          </div>
        </div>

        <PressableButton
          onClick={onReady}
          className="border-0"
          style={{
            height: 52,
            borderRadius: 12,
            backgroundColor: '#FF3B30',
            color: '#0F191B',
          }}
        >
          Ready
        </PressableButton>
      </div>
    </BottomSheet>
  )
}
