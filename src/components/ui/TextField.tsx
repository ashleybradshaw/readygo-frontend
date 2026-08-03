import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, hint, error, leadingIcon, trailingIcon, className = '', ...props },
    ref,
  ) {
    return (
      <label className="flex w-full flex-col gap-1.5">
        <span className="text-sm font-bold text-rg-text-muted">{label}</span>
        <div
          className={`flex h-[54px] items-center gap-2.5 rounded-[10px] border bg-rg-surface px-4 ${
            error
              ? 'border-rg-red-bright'
              : 'border-[#365466] focus-within:border-rg-text-muted'
          }`}
        >
          {leadingIcon ? (
            <span className="shrink-0 text-rg-text-dim">{leadingIcon}</span>
          ) : null}
          <input
            ref={ref}
            className={`min-w-0 flex-1 bg-transparent text-base font-bold text-rg-text outline-none placeholder:text-[#4F6163] ${className}`}
            {...props}
          />
          {trailingIcon ? (
            <span className="shrink-0 text-rg-text-dim">{trailingIcon}</span>
          ) : null}
        </div>
        {error ? (
          <motion.p
            initial={{ x: 0 }}
            animate={{ x: [0, -6, 6, -4, 4, 0] }}
            transition={{ duration: 0.35 }}
            className="text-xs font-bold text-rg-red-bright"
          >
            {error}
          </motion.p>
        ) : hint ? (
          <p className="text-xs font-bold text-rg-text-dim">{hint}</p>
        ) : null}
      </label>
    )
  },
)
