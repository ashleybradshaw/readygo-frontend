import { Bike, PersonStanding, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { TextField } from '../components/ui/TextField'
import { buildReviewSummary } from '../lib/onboarding'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function ReviewProfilePage() {
  const navigate = useNavigate()
  const draft = useReadyGoStore((state) => state.profileDraft)
  const updateProfileDraft = useReadyGoStore((state) => state.updateProfileDraft)
  const [name, setName] = useState(draft.name)

  const defaultName =
    draft.activityType === 'Cycle' ? 'Cycle Profile One' : 'Run Profile One'

  const paragraphs = useMemo(
    () =>
      buildReviewSummary({
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

  return (
    <div className="flex h-full flex-col bg-rg-base-alt px-5 pb-6 pt-10">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-rg-text-muted">
            Ready?
          </h1>
          <p className="mt-1 text-base font-bold uppercase tracking-[-0.01em] text-rg-text-muted">
            If everything looks good, let&apos;s go.
          </p>
          <div className="mt-3">
            <ProgressBar value={100} />
          </div>
        </div>
        <button
          type="button"
          aria-label="Close review"
          onClick={() => navigate('/')}
          className="rounded-full bg-rg-surface p-2.5 text-rg-text-muted"
        >
          <X size={18} />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto">
        <div className="flex items-center justify-between gap-4 rounded-t-[8px] bg-[#1C2A33] px-4 py-3 outline outline-1 outline-[#365466]">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-rg-base-alt text-[#7CFF00]">
              {draft.activityType === 'Cycle' ? (
                <Bike size={16} />
              ) : (
                <PersonStanding size={16} />
              )}
            </div>
            <span className="text-sm font-bold capitalize tracking-[-1px] text-[#DCE4E6]">
              {name.trim() || defaultName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-8 overflow-hidden rounded-full bg-gradient-to-b from-[#7CFF00] to-[#FF0000]" />
            <span className="text-sm font-bold capitalize tracking-[-1px] text-[#DCE4E6]">
              GOAI built
            </span>
          </div>
        </div>

        <div className="bg-[#1C2A33] p-3 outline outline-1 outline-[#365466]">
          <TextField
            label="Profile name"
            placeholder="Name your profile (Optional)"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        {paragraphs.map((paragraph, index) => (
          <div
            key={paragraph}
            className={`bg-[#1C2A33] p-5 outline outline-1 outline-[#365466] ${
              index === paragraphs.length - 1 ? 'rounded-b-[8px]' : ''
            }`}
          >
            <p className="text-base font-bold capitalize tracking-[-1px] text-[#DCE4E6]">
              {paragraph}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col items-center gap-3">
        <PressableButton
          onClick={() => {
            updateProfileDraft({ name: name.trim() || defaultName })
            navigate('/setup/gathering')
          }}
        >
          Save
        </PressableButton>
        <button
          type="button"
          onClick={() => navigate('/setup')}
          className="text-base font-bold text-rg-text-muted underline underline-offset-2"
        >
          Back to edit
        </button>
      </div>
    </div>
  )
}
