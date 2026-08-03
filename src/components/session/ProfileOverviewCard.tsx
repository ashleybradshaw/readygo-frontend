import { Bike, List, Network, PersonStanding } from 'lucide-react'
import type { ReadyGoProfile } from '../../store/useReadyGoStore'

interface ProfileOverviewCardProps {
  profile: ReadyGoProfile
  savedRoutesCount: number
}

export function ProfileOverviewCard({
  profile,
  savedRoutesCount,
}: ProfileOverviewCardProps) {
  return (
    <section className="rounded-[12px] bg-rg-surface p-4 outline outline-1 outline-[#365466]">
      <div className="mb-3 flex items-center justify-end gap-2">
        <span className="flex size-8 items-center justify-center rounded-md bg-rg-base-alt text-[#7CFF00]">
          {profile.activityType === 'Cycle' ? (
            <Bike size={16} />
          ) : (
            <PersonStanding size={16} />
          )}
        </span>
        <p className="text-sm font-bold tracking-[-1px] text-[#DCE4E6]">
          {profile.name}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-[10px] bg-rg-base-alt px-3 py-2">
          <Network size={16} className="text-rg-text-muted" />
          <div>
            <p className="text-xs font-bold text-rg-text-muted">Times used</p>
            <p className="text-sm font-bold text-rg-text">{profile.timesUsed}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-[10px] bg-rg-base-alt px-3 py-2">
          <List size={16} className="text-rg-text-muted" />
          <div>
            <p className="text-xs font-bold text-rg-text-muted">Saved routes</p>
            <p className="text-sm font-bold text-rg-text">{savedRoutesCount}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
