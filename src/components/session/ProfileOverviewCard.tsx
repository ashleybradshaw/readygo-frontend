import { Bike, List, Network } from 'lucide-react'
import type { ReadyGoProfile } from '../../store/useReadyGoStore'
import { RunShoeIcon } from '../ui/RunShoeIcon'

interface ProfileOverviewCardProps {
  profile: ReadyGoProfile
  savedRoutesCount: number
  isActive?: boolean
  onActivate?: () => void
}

export function ProfileOverviewCard({
  profile,
  savedRoutesCount,
  isActive = true,
  onActivate,
}: ProfileOverviewCardProps) {
  const ActivityIcon =
    profile.activityType === 'Cycle' ? Bike : RunShoeIcon

  const handleActivate = () => {
    if (isActive || !onActivate) return
    onActivate()
  }

  return (
    <section className="rounded-[10px] border border-[#39484A] bg-[#182629] p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        {isActive ? (
          <span className="inline-flex rounded-full bg-[#84BCA4]/20 px-2.5 py-1 text-xs font-bold tracking-[-0.01em] text-[#84BCA4]">
            Current profile
          </span>
        ) : (
          <button
            type="button"
            tabIndex={0}
            aria-label={`Activate ${profile.name}`}
            onClick={handleActivate}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleActivate()
              }
            }}
            className="inline-flex rounded-full bg-[#BC9C75]/20 px-2.5 py-1 text-xs font-bold tracking-[-0.01em] text-[#BC9C75]"
          >
            Activate Profile
          </button>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <ActivityIcon
            className="h-5 w-5 shrink-0 text-[#70FF00]"
            aria-hidden="true"
          />
          <p className="truncate text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
            {profile.name}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Network size={14} className="shrink-0 text-[#78ABCC]" aria-hidden="true" />
            <p className="text-xs font-bold tracking-[-0.01em] text-[#BACBC9]">
              Times used {profile.timesUsed}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <List size={14} className="shrink-0 text-[#78ABCC]" aria-hidden="true" />
            <p className="text-xs font-bold tracking-[-0.01em] text-[#BACBC9]">
              Saved routes {savedRoutesCount}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
