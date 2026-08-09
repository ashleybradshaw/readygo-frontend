import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { TextField } from '../components/ui/TextField'
import { EyeToggleIcon, PasswordFieldIcon } from '../components/ui/AuthIcons'
import { getPasswordChecks, passwordIsValid } from '../lib/onboarding'

export function NewPasswordPage() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const checks = useMemo(() => getPasswordChecks(password), [password])
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword
  const showMatchError =
    confirmPassword.length > 0 && password !== confirmPassword

  const canSubmit = passwordIsValid(password) && passwordsMatch

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-[#0F1918] px-5 pb-8 pt-[max(3.5rem,env(safe-area-inset-top))]">
      <div className="mb-8 flex flex-col gap-2.5">
        <div className="flex flex-col gap-[5px] uppercase">
          <h1 className="font-display text-2xl font-bold leading-8 tracking-[-0.02em] text-[#BACBC9]">
            New Password
          </h1>
          <p className="font-sans text-lg font-bold leading-[26px] tracking-[-0.01em] text-[#BACBC9]">
            Keeping everything secure.
          </p>
        </div>
        <p className="font-sans text-base leading-normal text-[#BACBC9]">
          Once saved, you&apos;ll be asked to sign in again.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <TextField
          label="New password"
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

        <ul className="mt-1 space-y-[5px] px-5 text-xs font-normal tracking-[0.01em]">
          <li className={checkColour(checks.minLength, 'amber')}>
            Minimum 8 characters
          </li>
          <li className={checkColour(checks.hasLetter, 'green')}>
            At least one letter
          </li>
          <li className={checkColour(checks.hasNumberOrSymbol, 'red')}>
            At least one number or special character (@, #, $, %)
          </li>
        </ul>
      </div>

      <div className="mt-6">
        <TextField
          label="Confirm new password"
          type={showConfirm ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Type your new password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={
            showMatchError
              ? "Passwords don't match. Give it another go."
              : undefined
          }
          leadingIcon={<PasswordFieldIcon />}
          trailingIcon={
            <button
              type="button"
              tabIndex={0}
              aria-label={
                showConfirm ? 'Hide confirm password' : 'Show confirm password'
              }
              onClick={() => setShowConfirm((value) => !value)}
            >
              <EyeToggleIcon hidden={showConfirm} />
            </button>
          }
        />
      </div>

      <div className="mt-auto flex flex-col items-center gap-1 pt-8">
        <PressableButton
          variant="cta"
          disabled={!canSubmit}
          onClick={() => navigate('/auth/reset-success', { replace: true })}
          className="rounded-[4px]"
          style={{ borderRadius: 4 }}
        >
          Save & continue
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

const checkColour = (passed: boolean, tone: 'amber' | 'green' | 'red') => {
  if (passed) return 'text-[#84BCA4]'
  if (tone === 'amber') return 'text-[#BC9C75]'
  if (tone === 'green') return 'text-[#84BCA4]/50'
  return 'text-[#BC757D]'
}
