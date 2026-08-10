type DistanceSliderProps = {
  minMiles?: number
  maxMiles: number
  value: number
  onChange: (miles: number) => void
}

export const DistanceSlider = ({
  minMiles = 1,
  maxMiles,
  value,
  onChange,
}: DistanceSliderProps) => {
  const progress = ((value - minMiles) / (maxMiles - minMiles)) * 100

  return (
    <section className="mb-[10px] flex w-full flex-col items-start rounded-[4px] border border-[#2D3739]/60 bg-[#182629]/40 p-4 text-left">
      <div className="flex w-full items-center justify-between gap-3">
        <h4 className="text-xs font-bold tracking-wider text-[#BACBC9] uppercase">
          Distance
        </h4>
        <span className="rounded-full border border-[#70FF00]/40 bg-[#70FF00]/15 px-3 py-1 text-xs font-bold text-[#70FF00]">
          [{value} Miles]
        </span>
      </div>
      <p className="mt-1 text-xs text-[#BACBC9]/70">How far do you want to go?</p>
      <input
        type="range"
        min={minMiles}
        max={maxMiles}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label="Distance in miles"
        className="guest-param-slider mt-3 w-full"
        style={{ ['--guest-progress' as string]: `${progress}%` }}
      />
      <div className="mt-2 flex w-full items-center justify-between">
        <span className="text-[11px] text-[#BACBC9]/50">1 Mile</span>
        <span className="text-[11px] text-[#BACBC9]/50">{maxMiles} Max</span>
      </div>
    </section>
  )
}
