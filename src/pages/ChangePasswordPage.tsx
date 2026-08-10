import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftCircle } from 'lucide-react'
import { PressableButton } from '../components/ui/PressableButton'
import { TextField } from '../components/ui/TextField'
import { EyeToggleIcon, PasswordFieldIcon } from '../components/ui/AuthIcons'
import { getPasswordChecks, passwordIsValid } from '../lib/onboarding'
import { showSuccessToast } from '../components/overlays/NotificationHost'

export function ChangePasswordPage() {
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
  const canSave = passwordIsValid(password) && passwordsMatch

  const handleBack = () => {
    navigate('/settings')
  }

  const handleSave = () => {
    if (!canSave) return
    showSuccessToast('Password updated', 'Your new password is saved.')
    navigate('/settings', { replace: true })
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-[#0F1918] px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-8">
      <button
        type="button"
        tabIndex={0}
        aria-label="Back to settings"
        onClick={handleBack}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleBack()
          }
        }}
        className="absolute top-6 left-6 z-20 cursor-pointer text-[#BACBC9] hover:text-white"
      >
        <ArrowLeftCircle className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="mt-10 mb-8 flex flex-col gap-2.5">
        <div className="flex flex-col gap-[5px] uppercase">
          <h1 className="font-display text-2xl leading-8 font-bold tracking-[-0.02em] text-[#BACBC9]">
            Change Password
          </h1>
          <p className="font-sans text-lg leading-[26px] font-bold tracking-[-0.01em] text-[#BACBC9]">
            Keeping everything secure.
          </p>
        </div>
        <p className="font-sans text-base leading-normal text-[#BACBC9]">
          Enter a new password to update your account credentials.
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

      <div className="mt-auto pt-8">
        <PressableButton
          disabled={!canSave}
          onClick={handleSave}
          className="rounded-[4px] border-0"
          style={{
            height: 52,
            borderRadius: 4,
            backgroundColor: canSave ? '#70FF00' : '#2D3739',
            color: canSave ? '#0F1918' : '#BACBC9',
            fontWeight: 700,
          }}
        >
          Save
        </PressableButton>
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
