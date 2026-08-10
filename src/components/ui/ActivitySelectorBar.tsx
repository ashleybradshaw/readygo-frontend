import { Bike } from 'lucide-react'
import { BinaryToggle } from '../common/Toggle'
import { RunShoeIcon } from './RunShoeIcon'

type ActivitySelectorBarProps = {
  isCycle: boolean
  onChange: (toCycle: boolean) => void
}

export const ActivitySelectorBar = ({
  isCycle,
  onChange,
}: ActivitySelectorBarProps) => (
  <div className="mb-3 flex w-full items-center justify-between rounded-full border border-[#2D3739] bg-[#182629]/80 px-4 py-2">
    <div className="flex items-center gap-5">
      <button
        type="button"
        tabIndex={0}
        aria-pressed={!isCycle}
        aria-label="Run"
        onClick={() => onChange(false)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onChange(false)
          }
        }}
        className={`inline-flex items-center gap-1.5 text-sm font-bold transition-colors ${
          isCycle ? 'text-[#BACBC9]' : 'text-[#7CFF00]'
        }`}
      >
        <RunShoeIcon
          className={`h-5 w-5 ${isCycle ? 'text-[#BACBC9]' : 'text-[#7CFF00]'}`}
        />
        Run
      </button>
      <button
        type="button"
        tabIndex={0}
        aria-pressed={isCycle}
        aria-label="Cycle"
        onClick={() => onChange(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onChange(true)
          }
        }}
        className={`inline-flex items-center gap-1.5 text-sm font-bold transition-colors ${
          isCycle ? 'text-[#7CFF00]' : 'text-[#BACBC9]'
        }`}
      >
        <Bike
          className={`h-5 w-5 ${isCycle ? 'text-[#7CFF00]' : 'text-[#BACBC9]'}`}
          aria-hidden="true"
        />
        Cycle
      </button>
    </div>

    <BinaryToggle
      label="Toggle cycling or running"
      checked={isCycle}
      onChange={onChange}
    />
  </div>
)
