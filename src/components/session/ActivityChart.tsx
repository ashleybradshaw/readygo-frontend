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
    <section className="rounded-[10px] border border-[#39484A] bg-[#182629] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
          [{total}] Total Miles
        </p>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-[#BACBC9]">
            <span className="size-2.5 rounded-full bg-[#84BCA4]" aria-hidden="true" />
            Most
          </span>
          <span className="flex items-center gap-1.5 text-[#BACBC9]">
            <span className="size-2.5 rounded-full bg-[#BC9C75]" aria-hidden="true" />
            Least
          </span>
        </div>
      </div>

      <div className="mb-4 flex rounded-full bg-[#0F1918] p-1">
        {ranges.map((item) => {
          const active = item.id === range
          return (
            <button
              key={item.id}
              type="button"
              tabIndex={0}
              aria-label={`Show ${item.label} activity`}
              aria-pressed={active}
              onClick={() => onRangeChange(item.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onRangeChange(item.id)
                }
              }}
              className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                active
                  ? 'bg-[#DCE4E2] text-[#0F191B]'
                  : 'text-[#BACBC9]/70'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="flex h-36 items-end justify-between gap-1.5">
        {points.map((point) => {
          const height = Math.max(12, (point.miles / max) * 100)
          const isMost = point.miles === max
          const isLeast = point.miles === min && min !== max
          return (
            <div
              key={point.label}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div className="flex w-full flex-1 items-end justify-center rounded-[10px] bg-[#0F1918] px-1 pb-1.5 pt-2">
                <div
                  className={`w-3.5 rounded-full ${
                    isMost
                      ? 'bg-[#84BCA4]'
                      : isLeast
                        ? 'bg-[#BC9C75]'
                        : 'bg-[#BACBC9]/35'
                  }`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-[10px] font-bold uppercase text-[#BACBC9]/70">
                {point.label}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
