type DayKind = 'inactive' | 'checked' | 'session'

interface ActivityMatrix30Props {
  nodes: DayKind[]
  milesLabel: string
  sessionsLabel: string
}

const nodeClass = (kind: DayKind) => {
  if (kind === 'session') {
    return 'bg-[#70FF00] shadow-[0_0_8px_rgba(112,255,0,0.55)]'
  }
  if (kind === 'checked') return 'bg-white'
  return 'bg-[#182629]'
}

export const ActivityMatrix30 = ({
  nodes,
  milesLabel,
  sessionsLabel,
}: ActivityMatrix30Props) => {
  const displayNodes =
    nodes.length >= 30
      ? nodes.slice(0, 30)
      : [...nodes, ...Array.from({ length: 30 - nodes.length }, () => 'inactive' as DayKind)]

  return (
    <section className="text-center">
      <h2 className="font-display text-base font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
        30 Day Activity
      </h2>
      <p className="mt-1 text-xs font-bold text-[#BACBC9]/80">
        {milesLabel} · {sessionsLabel}
      </p>
      <div className="mx-auto mt-4 space-y-1.5">
        {[0, 1].map((row) => (
          <div key={row} className="flex justify-center gap-1.5">
            {displayNodes.slice(row * 15, row * 15 + 15).map((kind, index) => (
              <span
                key={`${row}-${index}`}
                className={`size-2.5 rounded-full ${nodeClass(kind)}`}
                aria-hidden="true"
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-bold text-[#BACBC9]/80">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#182629]" />
          Inactive
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-white" />
          Checked in
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#70FF00]" />
          Session
        </span>
      </div>
    </section>
  )
}

export type { DayKind }
