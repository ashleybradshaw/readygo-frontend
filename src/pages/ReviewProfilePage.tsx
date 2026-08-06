import { Bike, PersonStanding } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CancelProfileModal } from '../components/onboarding/CancelProfileModal'
import { SuccessProfileOverlay } from '../components/setup/SuccessProfileOverlay'
import { SettingsCloseButton } from '../components/settings/SettingsCloseButton'
import { GoaiCardIcon } from '../components/ui/BasecampIcons'
import { PressableButton } from '../components/ui/PressableButton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { TextField } from '../components/ui/TextField'
import { buildReviewSummaryParts } from '../lib/onboarding'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function ReviewProfilePage() {
  const navigate = useNavigate()
  const draft = useReadyGoStore((state) => state.profileDraft)
  const editingProfileId = useReadyGoStore((state) => state.editingProfileId)
  const updateProfileDraft = useReadyGoStore((state) => state.updateProfileDraft)
  const completeProfileSetup = useReadyGoStore(
    (state) => state.completeProfileSetup,
  )
  const resetProfileDraft = useReadyGoStore((state) => state.resetProfileDraft)

  const [name, setName] = useState(draft.name)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  const defaultName =
    draft.activityType === 'Cycle' ? 'Cycle Profile One' : 'Run Profile One'

  const summaryParagraphs = useMemo(
    () =>
      buildReviewSummaryParts({
        activityType: draft.activityType,
        locationMode: draft.preferences.locationMode,
        postcode: draft.preferences.postcode,
        preferredTimes: draft.preferences.preferredTimes,
        fitnessLevel: draft.preferences.fitnessLevel,
        weatherChoices: draft.preferences.weatherChoices,
        clothingSuggestions: draft.preferences.clothingSuggestions,
        mapStyle: draft.preferences.mapStyle,
        sessionDuration: draft.preferences.sessionDuration,
      }),
    [draft],
  )

  const ActivityIcon =
    draft.activityType === 'Cycle' ? Bike : PersonStanding

  const handleSave = () => {
    const profileName = name.trim() || defaultName
    updateProfileDraft({ name: profileName })

    completeProfileSetup({
      id: editingProfileId ?? crypto.randomUUID(),
      name: profileName,
      activityType: draft.activityType,
      timesUsed:
        useReadyGoStore
          .getState()
          .savedProfiles.find((item) => item.id === editingProfileId)
          ?.timesUsed ?? 0,
      preferences: { ...draft.preferences },
    })
    setSuccessOpen(true)
  }

  const handleGoBasecamp = () => {
    setSuccessOpen(false)
    navigate('/', { replace: true })
  }

  const handleCancelToBasecamp = () => {
    resetProfileDraft()
    setCancelOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <div className="relative flex h-full flex-col bg-[#0F1918] px-6 py-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-[#BACBC9]">
            Ready?
          </h1>
          <p className="text-base font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
            If everything looks good, let&apos;s go.
          </p>
          <ProgressBar value={100} />
        </div>
        <SettingsCloseButton
          variant="onDark"
          onClick={() => setCancelOpen(true)}
        />
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-[10px] bg-[#182629] px-3 py-2">
            <ActivityIcon
              size={16}
              className="shrink-0 text-[#70FF00]"
              aria-hidden="true"
            />
            <span className="text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
              {defaultName}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-[10px] bg-[#182629] px-3 py-2">
            <GoaiCardIcon size={16} />
            <span className="text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
              GOAI Built
            </span>
          </div>
        </div>

        <TextField
          label=""
          aria-label="Name your profile (Optional)"
          placeholder="Name your profile (Optional)"
          value={name}
          onChange={(event) => setName(event.target.value)}
          leadingIcon={
            <ActivityIcon size={20} strokeWidth={2} aria-hidden="true" />
          }
        />

        {summaryParagraphs.map((parts, index) => (
          <div
            key={index}
            className="rounded-[10px] border border-[#39484A] bg-[#182629] p-5"
          >
            <p className="text-base font-bold leading-relaxed tracking-[-0.01em] text-[#BACBC9]">
              {parts.map((part, partIndex) =>
                part.highlight ? (
                  <span key={partIndex} className="font-bold text-[#84BCA4]">
                    {part.text}
                  </span>
                ) : (
                  <span key={partIndex}>{part.text}</span>
                ),
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="flex shrink-0 flex-col items-center gap-3 pt-2">
        <PressableButton variant="cta" onClick={handleSave}>
          Save
        </PressableButton>
        <button
          type="button"
          tabIndex={0}
          aria-label="Back to edit"
          onClick={() => navigate('/setup')}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              navigate('/setup')
            }
          }}
          className="px-5 py-2 font-sans text-base font-bold tracking-[-0.01em] text-[#BACBC9] underline underline-offset-2"
        >
          Back to edit
        </button>
      </div>

      <CancelProfileModal
        open={cancelOpen}
        onStay={() => setCancelOpen(false)}
        onCancel={handleCancelToBasecamp}
      />

      <SuccessProfileOverlay
        open={successOpen}
        onClose={handleGoBasecamp}
        onBasecamp={handleGoBasecamp}
      />
    </div>
  )
}
