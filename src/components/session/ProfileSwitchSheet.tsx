import { useNavigate } from 'react-router-dom'
import { BottomSheet } from '../ui/BottomSheet'
import { ClosePillButton } from '../ui/ClosePillButton'
import { useReadyGoStore, type ReadyGoProfile } from '../../store/useReadyGoStore'

interface ProfileSwitchSheetProps {
  open: boolean
  onClose: () => void
  profiles: ReadyGoProfile[]
}

export const ProfileSwitchSheet = ({
  open,
  onClose,
  profiles,
}: ProfileSwitchSheetProps) => {
  const navigate = useNavigate()
  const currentProfile = useReadyGoStore((state) => state.currentProfile)
  const activateProfile = useReadyGoStore((state) => state.activateProfile)
  const resetProfileDraft = useReadyGoStore((state) => state.resetProfileDraft)
  const startEditProfile = useReadyGoStore((state) => state.startEditProfile)

  const isSingle = profiles.length <= 1

  const handleCreateProfile = () => {
    resetProfileDraft()
    onClose()
    navigate('/user/location-activity')
  }

  const handleEditProfile = () => {
    if (currentProfile) {
      startEditProfile(currentProfile.id)
    }
    onClose()
    navigate('/user/location-activity')
  }

  const handleSelectProfile = (profileId: string) => {
    activateProfile(profileId)
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} tone="dark">
      <div className="flex flex-col gap-5 pb-2 pt-1 text-[#BACBC9]">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-xl font-bold uppercase tracking-[-0.02em]">
            {isSingle ? 'Profile Options' : 'Switch Profile'}
          </h2>
          <ClosePillButton onClick={onClose} />
        </div>

        {isSingle ? (
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
        ) : (
          <div className="space-y-2">
            {profiles.map((profile) => {
              const active = profile.id === currentProfile?.id
              return (
                <button
                  key={profile.id}
                  type="button"
                  tabIndex={0}
                  aria-label={`Select ${profile.name}`}
                  aria-pressed={active}
                  onClick={() => handleSelectProfile(profile.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      handleSelectProfile(profile.id)
                    }
                  }}
                  className={`flex h-10 w-full items-center justify-between rounded-[4px] px-3 text-left text-xs font-medium ${
                    active
                      ? 'bg-[#182629] text-[#70FF00] outline outline-1 outline-[#70FF00]'
                      : 'bg-[#182629] text-[#BACBC9]'
                  }`}
                >
                  <span>{profile.name}</span>
                  <span className="text-[#BACBC9]/70">{profile.activityType}</span>
                </button>
              )
            })}
            <button
              type="button"
              tabIndex={0}
              aria-label="Create new profile"
              onClick={handleCreateProfile}
              className="mt-2 h-8 w-full rounded-[4px] bg-[#E6F2F0] text-xs font-medium text-[#0F1918]"
            >
              Create new profile
            </button>
          </div>
        )}
      </div>
    </BottomSheet>
  )
}
