import { motion } from 'framer-motion'

interface PaginationDotsProps {
  count: number
  activeIndex: number
  className?: string
  activeWidth?: number
  inactiveColor?: string
  onDotClick?: (index: number) => void
}

export function PaginationDots({
  count,
  activeIndex,
  className = '',
  activeWidth = 28,
  inactiveColor = '#BACBC9',
  onDotClick,
}: PaginationDotsProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {Array.from({ length: count }).map((_, index) => {
        const active = index === activeIndex
        const shared = {
          initial: false as const,
          animate: {
            width: active ? activeWidth : 8,
            backgroundColor: active ? '#84BCA4' : inactiveColor,
          },
          transition: { type: 'spring' as const, stiffness: 420, damping: 32 },
          className: 'block h-2 shrink-0 rounded-full',
        }

        if (onDotClick) {
          return (
            <motion.button
              key={index}
              type="button"
              aria-label={`Go to step ${index + 1}`}
              aria-current={active ? 'step' : undefined}
              onClick={() => onDotClick(index)}
              {...shared}
            />
          )
        }

        return <motion.span key={index} aria-hidden="true" {...shared} />
      })}
    </div>
  )
}
