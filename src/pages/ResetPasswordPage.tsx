import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { TextField } from '../components/ui/TextField'
import { CloseBoxedIcon, EmailFieldIcon } from '../components/ui/AuthIcons'
import { isValidEmail } from '../lib/onboarding'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)

  const emailError =
    emailTouched && email && !isValidEmail(email)
      ? 'Use a valid email address'
      : undefined

  const canSubmit = isValidEmail(email)

  const handleClose = () => {
    navigate('/auth/login')
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-[#0F1918] px-5 pb-8 pt-[83px]">
      <button
        type="button"
        aria-label="Close"
        onClick={handleClose}
        className="absolute top-[55px] right-5 flex items-center justify-center"
      >
        <CloseBoxedIcon shape="square" size={34} strokeWidth={3} />
      </button>

      <div className="mb-8 flex flex-col gap-2.5">
        <div className="flex flex-col gap-[5px] uppercase">
          <h1 className="font-display text-2xl font-bold leading-8 tracking-[-0.02em] text-[#BACBC9]">
            Reset password
          </h1>
          <p className="font-sans text-lg font-bold leading-[26px] tracking-[-0.01em] text-[#BACBC9]">
            Let&apos;s get you back on track.
          </p>
        </div>
        <p className="font-sans text-base leading-normal text-[#BACBC9]">
          Enter your registered email and we&apos;ll send you a link to reset
          your password.
        </p>
      </div>

      <TextField
        label="E-mail Address"
        type="email"
        autoComplete="email"
        placeholder="Use your registered email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        onBlur={() => setEmailTouched(true)}
        hint="Use the address you signed up with"
        error={emailError}
        leadingIcon={<EmailFieldIcon />}
      />

      <div className="mt-auto flex flex-col items-center gap-1 pt-8">
        <PressableButton
          variant="cta"
          disabled={!canSubmit}
          onClick={() =>
            navigate('/auth/reset/new', { state: { email: email.trim() } })
          }
        >
          Send reset link
        </PressableButton>
        <button
          type="button"
          className="px-5 py-5 font-sans text-base font-bold tracking-[-0.01em] text-[#BACBC9] underline underline-offset-2"
        >
          Need help?
        </button>
      </div>
    </div>
  )
}
