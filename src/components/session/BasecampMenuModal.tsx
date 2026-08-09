import { useNavigate } from 'react-router-dom'
import { BottomSheet } from '../ui/BottomSheet'
import { PressableButton } from '../ui/PressableButton'
import { ClosePillButton } from '../ui/ClosePillButton'
import { useReadyGoStore } from '../../store/useReadyGoStore'
import { getCreateProfilePath } from '../../lib/profileRouting'

const HOUR_PRESETS = [1, 2, 3, 4] as const

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
  const clampedHours = Math.min(4, Math.max(1, Math.round(hours)))
  const progress = ((clampedHours - 1) / 3) * 100

  const handleCreateProfile = () => {
    const destination = getCreateProfilePath(useReadyGoStore.getState())
    resetProfileDraft()
    onClose()
    navigate(destination)
  }

  const handleEditProfile = () => {
    if (currentProfile) {
      startEditProfile(currentProfile.id)
    }
    onClose()
    navigate('/user/profile-builder')
  }

  const handleSave = () => {
    onClose()
    onReady()
  }

  return (
    <BottomSheet open={open} onClose={onClose} tone="dark">
      <div className="flex flex-col gap-5 pb-2 pt-1 text-[#BACBC9]">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-xl font-bold uppercase tracking-[-0.02em]">
            Profile Options
          </h2>
          <ClosePillButton onClick={onClose} />
        </div>

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
            className="h-8 rounded-[4px] bg-[#E6F2F0] px-3 text-xs font-medium text-[#0F1918]"
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
            className="h-8 rounded-[4px] bg-[#E6F2F0] px-3 text-xs font-medium text-[#0F1918]"
          >
            Edit current profile
          </button>
        </div>

        <div>
          <h3 className="text-center font-display text-base font-bold uppercase tracking-[-0.01em]">
            Time Available
          </h3>
          <p className="mt-1 text-center text-xs font-bold text-[#BACBC9]/70">
            This will only affect your next route.
          </p>

          <div className="mt-4">
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              value={clampedHours}
              onChange={(event) => setHours(Number(event.target.value))}
              className="guest-param-slider w-full"
              style={{ ['--guest-progress' as string]: `${progress}%` }}
              aria-label="Time available"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {HOUR_PRESETS.map((preset) => {
                const active = clampedHours === preset
                return (
                  <button
                    key={preset}
                    type="button"
                    tabIndex={0}
                    aria-pressed={active}
                    onClick={() => setHours(preset)}
                    className={`h-8 rounded-[4px] border px-3 text-xs font-medium tracking-[-0.01em] ${
                      active
                        ? 'border-[#70FF00] bg-[#182629] text-[#70FF00]'
                        : 'border-transparent bg-[#182629] text-[#BACBC9]'
                    }`}
                  >
                    {preset} Hour{preset === 1 ? '' : 's'}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <PressableButton
          onClick={handleSave}
          className="rounded-[4px] border-0"
          style={{
            height: 52,
            borderRadius: 4,
            backgroundColor: '#E6F2F0',
            color: '#0F1918',
            fontWeight: 700,
          }}
        >
          Save
        </PressableButton>
      </div>
    </BottomSheet>
  )
}
