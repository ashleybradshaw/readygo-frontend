import {
  forwardRef,
  useState,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      hint,
      error,
      leadingIcon,
      trailingIcon,
      className = '',
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) {
    const [focused, setFocused] = useState(false)

    const borderClass = error
      ? 'border-[#BC757D]'
      : focused
        ? 'border-[#BACBC9]'
        : 'border-[#2D3739]'

    const iconClass = focused ? 'text-[#BACBC9]' : 'text-[#4F6163]'
    const inputTextClass = focused ? 'text-[#F5F7F7]' : 'text-[#BACBC9]'

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      setFocused(true)
      onFocus?.(event)
    }

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      setFocused(false)
      onBlur?.(event)
    }

    return (
      <label className="flex w-full flex-col gap-1.5">
        {label ? (
          <span className="text-sm font-normal text-[#BACBC9]">{label}</span>
        ) : null}
        <div
          className={`flex h-[52px] items-center gap-2.5 rounded-[4px] border bg-[#182629] px-5 ${borderClass}`}
        >
          {leadingIcon ? (
            <span className={`inline-flex size-6 shrink-0 items-center justify-center ${iconClass}`}>
              {leadingIcon}
            </span>
          ) : null}
          <input
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`min-w-0 flex-1 bg-transparent text-base font-bold tracking-[-0.01em] outline-none placeholder:text-[#4F6163] ${inputTextClass} ${className}`}
            {...props}
          />
          {trailingIcon ? (
            <span className={`inline-flex size-6 shrink-0 items-center justify-center ${iconClass}`}>
              {trailingIcon}
            </span>
          ) : null}
        </div>
        {error ? (
          <motion.p
            initial={{ x: 0 }}
            animate={{ x: [0, -6, 6, -4, 4, 0] }}
            transition={{ duration: 0.35 }}
            className="px-5 text-xs font-normal tracking-[0.01em] text-[#BC757D]"
          >
            {error}
          </motion.p>
        ) : hint ? (
          <p className="px-5 text-xs font-normal tracking-[0.01em] text-[#4F6163]">
            {hint}
          </p>
        ) : null}
      </label>
    )
  },
)
