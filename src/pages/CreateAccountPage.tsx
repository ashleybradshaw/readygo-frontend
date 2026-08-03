import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { TextField } from '../components/ui/TextField'
import { VerificationSheet } from '../components/onboarding/VerificationSheet'
import { NameCaptureSheet } from '../components/onboarding/NameCaptureSheet'
import {
  getPasswordChecks,
  isValidEmail,
  passwordIsValid,
} from '../lib/onboarding'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function CreateAccountPage() {
  const navigate = useNavigate()
  const setUserEmail = useReadyGoStore((state) => state.setUserEmail)
  const setAuthenticated = useReadyGoStore((state) => state.setAuthenticated)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [nameOpen, setNameOpen] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')

  const checks = useMemo(() => getPasswordChecks(password), [password])
  const emailError =
    emailTouched && email && !isValidEmail(email)
      ? 'Use a valid email address'
      : undefined

  const canSubmit = isValidEmail(email) && passwordIsValid(password)

  const openNameStep = (nextEmail: string) => {
    setPendingEmail(nextEmail)
    setUserEmail(nextEmail)
    setVerifyOpen(false)
    setNameOpen(true)
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-rg-base-alt px-5 pb-8 pt-12">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold uppercase tracking-[-0.02em] text-rg-text">
          Create account
        </h1>
        <p className="mt-1 text-lg font-bold uppercase text-rg-text">Welcome!</p>
      </div>

      <div className="flex flex-col gap-3">
        <PressableButton
          variant="secondary"
          onClick={() => openNameStep('apple@readygo.app')}
        >
          Continue with Apple
        </PressableButton>
        <PressableButton
          variant="secondary"
          onClick={() => openNameStep('google@readygo.app')}
        >
          Continue with Google
        </PressableButton>
      </div>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-rg-text-dim/40" />
        <span className="text-xs font-bold text-rg-text-dim">Or</span>
        <div className="h-px flex-1 bg-rg-text-dim/40" />
      </div>

      <div className="flex flex-col gap-4">
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
          leadingIcon={<Mail size={18} />}
        />

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Type a new password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          leadingIcon={<LockKeyhole size={18} />}
          trailingIcon={
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((value) => !value)}
              className="text-rg-text-dim"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <ul className="space-y-1 text-xs font-bold">
          <li className={checkColour(password, checks.minLength)}>
            Minimum 8 characters
          </li>
          <li className={checkColour(password, checks.hasLetter)}>
            At least one letter
          </li>
          <li className={checkColour(password, checks.hasNumberOrSymbol)}>
            At least one number or special character (@, #, $, %)
          </li>
        </ul>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <PressableButton
          disabled={!canSubmit}
          onClick={() => {
            setPendingEmail(email.trim())
            setVerifyOpen(true)
          }}
        >
          Create account
        </PressableButton>
        <p className="text-center text-sm font-bold text-rg-text-muted">
          Already have an account?{' '}
          <Link to="/auth/login" className="underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>

      <VerificationSheet
        open={verifyOpen}
        email={pendingEmail || email}
        onClose={() => setVerifyOpen(false)}
        onConfirmed={() => openNameStep(email.trim())}
      />

      <NameCaptureSheet
        open={nameOpen}
        onComplete={() => {
          setAuthenticated(true)
          navigate('/')
        }}
      />
    </div>
  )
}

function checkColour(password: string, passed: boolean) {
  if (!password) return 'text-rg-text-dim'
  if (passed) return 'text-rg-success'
  return 'text-rg-red-bright'
}
