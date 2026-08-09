import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthCloseButton } from '../components/auth/AuthCloseButton'
import { PressableButton } from '../components/ui/PressableButton'
import { TextField } from '../components/ui/TextField'
import { EmailFieldIcon } from '../components/ui/AuthIcons'
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

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-[#0F1918] px-5 pb-8 pt-[max(3.5rem,env(safe-area-inset-top))]">
      <AuthCloseButton onClick={() => navigate('/auth/login')} />

      <div className="mb-8 flex flex-col gap-2.5 pr-10">
        <div className="flex flex-col gap-[5px] uppercase">
          <h1 className="font-display text-2xl font-bold leading-8 tracking-[-0.02em] text-[#BACBC9]">
            Reset Password
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
            navigate('/auth/new-password', {
              state: { email: email.trim() },
            })
          }
          className="rounded-[4px]"
          style={{ borderRadius: 4 }}
        >
          Send reset link
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
