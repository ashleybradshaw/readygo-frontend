import { Lock } from 'lucide-react'
import { BottomSheet } from '../ui/BottomSheet'
import { PressableButton } from '../ui/PressableButton'
import { ClosePillButton } from '../ui/ClosePillButton'
import { useReadyGoStore } from '../../store/useReadyGoStore'

const HOUR_PRESETS = [1, 2, 3, 4] as const

interface GuestBasecampMenuModalProps {
  open: boolean
  onClose: () => void
  onEditProfile: () => void
  onSave: () => void
}

export function GuestBasecampMenuModal({
  open,
  onClose,
  onEditProfile,
  onSave,
}: GuestBasecampMenuModalProps) {
  const hours = useReadyGoStore((state) => state.oneTimeSessionHours)
  const setHours = useReadyGoStore((state) => state.setOneTimeSessionHours)
  const clampedHours = Math.min(4, Math.max(1, Math.round(hours)))
  const progress = ((clampedHours - 1) / 3) * 100

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
            aria-label="1 of 1 Save Session locked"
            disabled
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#2D3739] px-3 py-3 text-sm font-bold tracking-[-0.01em] text-[#829695]"
          >
            1/1 Save Session
            <Lock size={14} aria-hidden="true" />
          </button>
          <button
            type="button"
            tabIndex={0}
            aria-label="Edit current profile"
            onClick={onEditProfile}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onEditProfile()
              }
            }}
            className="rounded-full bg-[#BACBC9] px-3 py-3 text-sm font-bold tracking-[-0.01em] text-[#0F1918]"
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
                    className={`h-8 rounded-full border px-3 text-xs font-bold tracking-[-0.01em] ${
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
          onClick={onSave}
          className="rounded-[4px] border-0"
          style={{
            height: 52,
            borderRadius: 4,
            backgroundColor: '#BACBC9',
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
