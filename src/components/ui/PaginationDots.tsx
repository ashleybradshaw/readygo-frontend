interface PaginationDotsProps {
  count: number
  activeIndex: number
  className?: string
}

export function PaginationDots({
  count,
  activeIndex,
  className = '',
}: PaginationDotsProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {Array.from({ length: count }).map((_, index) => {
        const active = index === activeIndex
        return (
          <span
            key={index}
            className={`rounded-full transition-all ${
              active
                ? 'h-[10px] w-[41px] bg-rg-active'
                : 'size-[10px] bg-rg-text-muted/40'
            }`}
          />
        )
      })}
    </div>
  )
}
