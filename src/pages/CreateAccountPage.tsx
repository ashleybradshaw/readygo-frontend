import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { PressableButton } from '../components/ui/PressableButton'
import { TextField } from '../components/ui/TextField'
import { OAuthButton } from '../components/ui/OAuthButtons'
import {
  EmailFieldIcon,
  EyeToggleIcon,
  PasswordFieldIcon,
} from '../components/ui/AuthIcons'
import {
  getPasswordChecks,
  isValidEmail,
  passwordIsValid,
} from '../lib/onboarding'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function CreateAccountPage() {
  const navigate = useNavigate()
  const setUserEmail = useReadyGoStore((state) => state.setUserEmail)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)

  const checks = useMemo(() => getPasswordChecks(password), [password])
  const emailError =
    emailTouched && email && !isValidEmail(email)
      ? 'Use a valid email address'
      : undefined

  const canSubmit = isValidEmail(email) && passwordIsValid(password)

  const handleContinue = (nextEmail: string) => {
    setUserEmail(nextEmail)
    navigate('/auth/verify')
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-[#0F1918] px-5 pb-8 pt-[max(3.5rem,env(safe-area-inset-top))]">
      <button
        type="button"
        tabIndex={0}
        aria-label="Close"
        onClick={() => navigate('/welcome')}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            navigate('/welcome')
          }
        }}
        className="absolute top-6 right-6 z-20 cursor-pointer text-[#BACBC9]/60 hover:text-white"
      >
        <X className="h-6 w-6" strokeWidth={2.25} aria-hidden="true" />
      </button>

      <div className="mb-6 flex flex-col gap-[5px] uppercase">
        <h1 className="font-display text-2xl font-bold leading-8 tracking-[-0.02em] text-[#BACBC9]">
          Create Account
        </h1>
        <p className="font-sans text-lg font-bold leading-[26px] tracking-[-0.01em] text-[#BACBC9]">
          Welcome!
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <OAuthButton
          provider="apple"
          onClick={() => handleContinue('apple@readygo.app')}
        >
          Continue with Apple
        </OAuthButton>
        <OAuthButton
          provider="google"
          onClick={() => handleContinue('google@readygo.app')}
        >
          Continue with Google
        </OAuthButton>
      </div>

      <div className="my-5 flex items-center justify-center gap-2.5">
        <div className="h-px w-[100px] bg-[#BACBC9]/50" />
        <span className="font-sans text-base text-[#BACBC9]">Or</span>
        <div className="h-px w-[100px] bg-[#BACBC9]/50" />
      </div>

      <div className="flex flex-col gap-1">
        <TextField
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="Use your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => setEmailTouched(true)}
          hint="Use a valid email address"
          error={emailError}
          leadingIcon={<EmailFieldIcon />}
        />

        <div className="mt-2">
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Type a new password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            leadingIcon={<PasswordFieldIcon />}
            trailingIcon={
              <button
                type="button"
                tabIndex={0}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((value) => !value)}
              >
                <EyeToggleIcon hidden={showPassword} />
              </button>
            }
          />
        </div>

        <ul className="mt-1 space-y-[5px] px-5 text-xs font-normal tracking-[0.01em]">
          <li className={checkColour(checks.minLength)}>
            Minimum 8 characters
          </li>
          <li className={checkColour(checks.hasLetter)}>At least one letter</li>
          <li className={checkColour(checks.hasNumberOrSymbol)}>
            At least one number or special character (@, #, $, %)
          </li>
        </ul>
      </div>

      <div className="mt-auto flex flex-col items-center gap-4 pt-8 pb-6">
        <PressableButton
          variant="cta"
          disabled={!canSubmit}
          onClick={() => handleContinue(email.trim())}
          className="rounded-[4px]"
          style={{ borderRadius: 4 }}
        >
          Create account
        </PressableButton>
        <p className="pb-2 text-center text-sm text-[#BACBC9]">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="font-bold underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

const checkColour = (passed: boolean) =>
  passed ? 'text-[#84BCA4]' : 'text-[#BC757D]'
