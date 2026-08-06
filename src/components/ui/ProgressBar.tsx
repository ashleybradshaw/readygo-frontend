interface ProgressBarProps {
  value: number
}

export function ProgressBar({ value }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className="relative h-3 w-full overflow-hidden rounded-[20px] bg-[#1C2A33]">
      <div
        className="absolute inset-y-0 left-0 rounded-[20px] bg-[#70FF00] transition-[width] duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
