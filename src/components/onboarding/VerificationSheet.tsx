import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PressableButton } from '../ui/PressableButton'
import { TextField } from '../ui/TextField'
import { CloseBoxedIcon, KeyFieldIcon } from '../ui/AuthIcons'
import { formatCountdown } from '../../lib/onboarding'

interface VerificationSheetProps {
  open: boolean
  email: string
  onClose: () => void
  onConfirmed: () => void
}

const INITIAL_SECONDS = 10 * 60

export function VerificationSheet({
  open,
  email,
  onClose,
  onConfirmed,
}: VerificationSheetProps) {
  const [code, setCode] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS)
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (!open) return
    setCode('')
    setError(undefined)
    setSecondsLeft(INITIAL_SECONDS)
  }, [open])

  useEffect(() => {
    if (!open || secondsLeft <= 0) return
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [open, secondsLeft])

  const canConfirm = code.trim().length === 6 && secondsLeft > 0

  const confirm = () => {
    if (code.trim().length !== 6) {
      setError('Enter your 6-digit code')
      return
    }
    if (secondsLeft <= 0) {
      setError('Code expired. Send a new one.')
      return
    }
    onConfirmed()
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="verification-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col bg-[#0F1918] px-5 pb-8 pt-[70px]"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-[55px] right-5 flex size-11 items-center justify-center"
          >
            <CloseBoxedIcon shape="circle" />
          </button>

          <div className="pr-12">
            <div className="flex flex-col gap-[5px] uppercase">
              <h2
                id="verification-title"
                className="font-display text-2xl font-bold leading-8 tracking-[-0.02em] text-[#BACBC9]"
              >
                Verification code
              </h2>
              <p className="font-sans text-lg font-bold leading-[26px] tracking-[-0.01em] text-[#BACBC9]">
                Let&apos;s get you in securely.
              </p>
            </div>
            <p className="mt-2.5 font-sans text-base leading-normal text-[#BACBC9]">
              We&apos;ve sent a verification code to {email || 'your email'}. Check
              your inbox – it won&apos;t take long.
            </p>
          </div>

          <div className="mt-6">
            <TextField
              label="Verification code"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter your 6-digit code"
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                setError(undefined)
              }}
              error={error}
              leadingIcon={<KeyFieldIcon />}
            />
            {!error ? (
              <div className="mt-1 flex flex-col items-end gap-1 px-5">
                <p
                  className={`text-xs tracking-[0.01em] ${
                    secondsLeft <= 60 ? 'text-[#BC757D]' : 'text-[#BC9C75]'
                  }`}
                >
                  Valid for {formatCountdown(secondsLeft)}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSecondsLeft(INITIAL_SECONDS)
                    setError(undefined)
                  }}
                  className="font-sans text-xs font-normal tracking-[0.01em] text-[#BC9C75] underline underline-offset-2"
                >
                  Send a new code
                </button>
              </div>
            ) : null}
          </div>

          <div className="mt-auto flex flex-col items-center gap-1 pt-8">
            <PressableButton
              variant="cta"
              disabled={!canConfirm}
              onClick={confirm}
            >
              Confirm code
            </PressableButton>
            <button
              type="button"
              className="px-5 py-5 font-sans text-base font-bold tracking-[-0.01em] text-[#BACBC9] underline underline-offset-2"
            >
              Need help?
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
