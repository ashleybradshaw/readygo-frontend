import { useNavigate } from 'react-router-dom'
import { BottomSheet } from '../ui/BottomSheet'
import { PressableButton } from '../ui/PressableButton'
import { formatSessionHours } from '../../lib/session'
import { useReadyGoStore } from '../../store/useReadyGoStore'

interface SessionLengthSheetProps {
  open: boolean
  onClose: () => void
  onReady: () => void
}

export function SessionLengthSheet({
  open,
  onClose,
  onReady,
}: SessionLengthSheetProps) {
  const navigate = useNavigate()
  const hours = useReadyGoStore((state) => state.oneTimeSessionHours)
  const setHours = useReadyGoStore((state) => state.setOneTimeSessionHours)
  const progress = ((hours - 1) / 4) * 100

  return (
    <BottomSheet open={open} onClose={onClose} tone="light">
      <div className="flex flex-col gap-5 pt-1 pb-2 text-rg-text-on-accent">
        <div>
          <p className="text-sm font-bold uppercase">Profile</p>
          <div className="mt-2 grid grid-cols-2 gap-2 rounded-[12px] bg-black/10 p-2">
            <button
              type="button"
              onClick={() => {
                onClose()
                navigate('/setup')
              }}
              className="rounded-full bg-white px-3 py-3 text-sm font-bold"
            >
              Create new profile
            </button>
            <button
              type="button"
              onClick={() => {
                onClose()
                navigate('/setup')
              }}
              className="rounded-full bg-white px-3 py-3 text-sm font-bold"
            >
              Edit current profile
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase">Session</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-rg-text-on-accent/70">
            Set a one time session length (Beta)
          </p>

          <div className="mt-3 rounded-[14px] bg-black/10 px-4 py-5">
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
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold">
                Min [1 hr]
              </span>
              <span className="rounded-full bg-[#0F191B] px-3 py-1 text-xs font-bold text-[#7CFF00]">
                {formatSessionHours(hours)}
              </span>
            </div>
          </div>
        </div>

        <PressableButton
          className="bg-rg-red-cta text-rg-text-on-accent hover:bg-rg-red-bright"
          onClick={onReady}
        >
          Ready
        </PressableButton>
      </div>
    </BottomSheet>
  )
}
