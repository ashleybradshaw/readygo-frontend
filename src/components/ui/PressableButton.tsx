import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type PressableButtonProps = HTMLMotionProps<'button'> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'sheet'
}

const variants: Record<NonNullable<PressableButtonProps['variant']>, string> = {
  primary:
    'bg-rg-sheet text-rg-text-on-accent hover:bg-rg-sheet-light',
  secondary:
    'border border-rg-text-muted/40 bg-transparent text-rg-text',
  ghost: 'bg-transparent text-rg-text-muted underline underline-offset-2',
  danger: 'bg-rg-surface text-rg-text-muted',
  sheet: 'bg-rg-base-alt text-rg-text',
}

export function PressableButton({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}: PressableButtonProps) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.97 }}
      className={`flex h-[54px] w-full items-center justify-center rounded-[10px] px-5 font-action text-base font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
