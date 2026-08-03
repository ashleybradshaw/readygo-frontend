import type { ActivityPoint, ChartRange } from '../../store/useReadyGoStore'

interface ActivityChartProps {
  points: ActivityPoint[]
  range: ChartRange
  onRangeChange: (range: ChartRange) => void
}

const ranges: { id: ChartRange; label: string }[] = [
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
]

export function ActivityChart({
  points,
  range,
  onRangeChange,
}: ActivityChartProps) {
  const values = points.map((point) => point.miles)
  const max = Math.max(...values, 1)
  const min = Math.min(...values)
  const total = Math.round(values.reduce((sum, value) => sum + value, 0) * 10) / 10

  return (
    <section className="rounded-[12px] bg-rg-surface p-4 outline outline-1 outline-[#365466]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-rg-text-muted">
          [{total}] Total Miles
        </p>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-rg-text-muted">
            <span className="size-2.5 rounded-full bg-[#7CFF00]" />
            Most
          </span>
          <span className="flex items-center gap-1.5 text-rg-text-muted">
            <span className="size-2.5 rounded-full bg-[#C5A075]" />
            Least
          </span>
        </div>
      </div>

      <div className="mb-4 flex rounded-full bg-rg-base-alt p-1">
        {ranges.map((item) => {
          const active = item.id === range
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onRangeChange(item.id)}
              className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                active
                  ? 'bg-rg-sheet text-rg-text-on-accent'
                  : 'text-rg-text-muted'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="flex h-36 items-end justify-between gap-2">
        {points.map((point) => {
          const height = Math.max(12, (point.miles / max) * 100)
          const isMost = point.miles === max
          const isLeast = point.miles === min && min !== max
          return (
            <div
              key={point.label}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div className="flex w-full flex-1 items-end rounded-[10px] bg-rg-base-alt px-1 pb-1 pt-2">
                <div
                  className={`w-full rounded-[8px] ${
                    isMost
                      ? 'bg-[#7CFF00]'
                      : isLeast
                        ? 'bg-[#C5A075]'
                        : 'bg-rg-text-muted/35'
                  }`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-[10px] font-bold uppercase text-rg-text-muted">
                {point.label}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
