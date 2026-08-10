import { Bike } from 'lucide-react'
import { RunShoeIcon } from './RunShoeIcon'

type ActivitySelectorBarProps = {
  isCycle: boolean
  onChange: (toCycle: boolean) => void
}

export const ActivitySelectorBar = ({
  isCycle,
  onChange,
}: ActivitySelectorBarProps) => {
  const handleToggle = () => {
    onChange(!isCycle)
  }

  return (
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

      <button
        type="button"
        role="switch"
        aria-checked={isCycle}
        aria-label="Toggle cycling or running"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleToggle()
          }
        }}
        className="relative flex h-[17px] w-[53px] shrink-0 cursor-pointer items-center rounded-full border-2 border-[#2D3739] bg-[#0F191B] p-[2px]"
      >
        <span
          aria-hidden="true"
          className={`h-[13px] w-[13px] rounded-full transition-transform duration-200 ease-in-out ${
            isCycle
              ? 'translate-x-[32px] bg-[#7CFF00]'
              : 'translate-x-0 bg-[#BACBC9]'
          }`}
        />
      </button>
    </div>
  )
}
