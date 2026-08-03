import { KeyRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BottomSheet } from '../ui/BottomSheet'
import { PressableButton } from '../ui/PressableButton'
import { TextField } from '../ui/TextField'
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
    <BottomSheet open={open} onClose={onClose} tone="dark">
      <div className="relative flex flex-col gap-5 pt-2">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-0 right-0 rounded-full bg-rg-surface p-2 text-rg-text-muted"
        >
          <X size={18} />
        </button>

        <div className="pr-10">
          <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-rg-text">
            Verification code
          </h2>
          <p className="mt-1 text-lg font-bold uppercase text-rg-text">
            Let&apos;s get you in securely.
          </p>
          <p className="mt-3 text-sm text-rg-text-muted">
            We&apos;ve sent a verification code to {email || 'your email'}. Check
            your inbox – it won&apos;t take long.
          </p>
        </div>

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
          leadingIcon={<KeyRound size={18} />}
        />

        <p
          className={`text-sm font-bold ${
            secondsLeft <= 60 ? 'text-rg-red-bright' : 'text-rg-amber'
          }`}
        >
          Valid for {formatCountdown(secondsLeft)}
        </p>

        <div className="mt-2 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSecondsLeft(INITIAL_SECONDS)
              setError(undefined)
            }}
            className="text-sm font-bold text-rg-text underline underline-offset-2"
          >
            Send new code
          </button>
          <PressableButton onClick={confirm}>Confirm code</PressableButton>
          <button
            type="button"
            className="text-sm font-bold text-rg-text underline underline-offset-2"
          >
            Need help?
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
