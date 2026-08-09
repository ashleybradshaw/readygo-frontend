import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type PressableButtonProps = HTMLMotionProps<'button'> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'sheet' | 'cta'
}

const variants: Record<NonNullable<PressableButtonProps['variant']>, string> = {
  primary:
    'bg-rg-sheet text-rg-text-on-accent hover:bg-rg-sheet-light',
  secondary:
    'border border-rg-text-muted/40 bg-transparent text-rg-text',
  ghost: 'bg-transparent text-rg-text-muted underline underline-offset-2',
  danger: 'bg-rg-surface text-rg-text-muted',
  sheet: 'bg-rg-base-alt text-rg-text',
  cta: 'bg-[#2D3739] text-[#BACBC9] hover:bg-[#2D3739] active:bg-[#1E2729]',
}

export function PressableButton({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  style,
  whileTap,
  ...props
}: PressableButtonProps) {
  const isCta = variant === 'cta'

  return (
    <motion.button
      type={type}
      whileTap={whileTap ?? (isCta ? { scale: 1 } : { scale: 0.97 })}
      style={style}
      className={`flex w-full items-center justify-center px-5 font-action text-base font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        style?.height == null ? (isCta ? 'h-[52px]' : 'h-[54px]') : ''
      } ${
        style?.borderRadius == null && !className.includes('rounded')
          ? isCta
            ? 'rounded-[4px]'
            : 'rounded-[4px]'
          : ''
      } ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
