import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftCircle } from 'lucide-react'
import { PressableButton } from '../components/ui/PressableButton'
import { TextField } from '../components/ui/TextField'
import { KeyFieldIcon } from '../components/ui/AuthIcons'
import { formatCountdown } from '../lib/onboarding'
import { useReadyGoStore } from '../store/useReadyGoStore'
import { showSuccessToast } from '../components/overlays/NotificationHost'

const CODE_TTL_SECONDS = 10 * 60

export function VerificationCodePage() {
  const navigate = useNavigate()
  const userEmail = useReadyGoStore((state) => state.userEmail)
  const [code, setCode] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(CODE_TTL_SECONDS)

  useEffect(() => {
    if (!userEmail) {
      navigate('/auth/create', { replace: true })
    }
  }, [navigate, userEmail])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [secondsLeft])

  const canSubmit = code.replace(/\D/g, '').length === 6 && secondsLeft > 0

  const handleResend = () => {
    setSecondsLeft(CODE_TTL_SECONDS)
    setCode('')
    showSuccessToast('Code sent', 'Check your inbox for a new code.')
  }

  const handleConfirm = () => {
    if (!canSubmit) return
    navigate('/auth/handle-claim')
  }

  if (!userEmail) return null

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-[#0F1918] px-5 pb-8 pt-[max(3.5rem,env(safe-area-inset-top))]">
      <button
        type="button"
        tabIndex={0}
        aria-label="Back to create account"
        onClick={() => navigate('/auth/create')}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            navigate('/auth/create')
          }
        }}
        className="absolute top-6 left-6 z-20 cursor-pointer text-[#BACBC9]/60 hover:text-white"
      >
        <ArrowLeftCircle className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="mb-8 flex flex-col gap-2.5">
        <div className="flex flex-col gap-[5px] uppercase">
          <h1 className="font-display text-2xl font-bold leading-8 tracking-[-0.02em] text-[#BACBC9]">
            Verification Code
          </h1>
          <p className="font-sans text-lg font-bold leading-[26px] tracking-[-0.01em] text-[#BACBC9]">
            Let&apos;s get you in securely.
          </p>
        </div>
        <p className="font-sans text-base leading-normal text-[#BACBC9]">
          We&apos;ve sent a verification code to your email. Check your inbox –
          it won&apos;t take long.
        </p>
      </div>

      <TextField
        label="Verification code"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="Enter your 6-digit code"
        value={code}
        onChange={(event) =>
          setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
        }
        leadingIcon={<KeyFieldIcon />}
      />

      <div className="mt-3 flex flex-col items-end gap-1 px-1">
        <p className="text-xs font-bold tracking-[0.01em] text-[#BC9C75]">
          Valid for {formatCountdown(secondsLeft)}
        </p>
        <button
          type="button"
          tabIndex={0}
          aria-label="Send a new code"
          onClick={handleResend}
          className="text-xs font-bold tracking-[0.01em] text-[#BC9C75] underline underline-offset-2"
        >
          Send a new code
        </button>
      </div>

      <div className="mt-auto flex flex-col items-center gap-1 pt-8">
        <PressableButton
          variant="cta"
          disabled={!canSubmit}
          onClick={handleConfirm}
          className="rounded-[4px]"
          style={{ borderRadius: 4 }}
        >
          Confirm code
        </PressableButton>
        <button
          type="button"
          tabIndex={0}
          className="px-5 py-5 font-sans text-base font-bold tracking-[-0.01em] text-[#BACBC9] underline underline-offset-2"
        >
          Need help?
        </button>
      </div>
    </div>
  )
}
