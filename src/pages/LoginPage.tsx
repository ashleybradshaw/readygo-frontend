import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { TextField } from '../components/ui/TextField'
import { OAuthButton } from '../components/ui/OAuthButtons'
import {
  EmailFieldIcon,
  EyeToggleIcon,
  PasswordFieldIcon,
} from '../components/ui/AuthIcons'
import { showSuccessToast } from '../components/overlays/NotificationHost'
import { isValidEmail } from '../lib/onboarding'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function LoginPage() {
  const navigate = useNavigate()
  const setUserEmail = useReadyGoStore((state) => state.setUserEmail)
  const setAuthenticated = useReadyGoStore((state) => state.setAuthenticated)
  const userName = useReadyGoStore((state) => state.userName)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)

  const emailError =
    emailTouched && email && !isValidEmail(email)
      ? 'Use a valid email address'
      : undefined

  const finishLogin = (nextEmail: string) => {
    setUserEmail(nextEmail)
    if (!userName) {
      navigate('/setup/account-created')
      return
    }
    setAuthenticated(true)
    showSuccessToast('Login updated', 'Welcome back.')
    navigate('/')
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-[#0F1918] px-5 pb-8 pt-[83px]">
      <div className="mb-8 flex flex-col gap-[5px] uppercase">
        <h1 className="font-display text-2xl font-bold leading-8 tracking-[-0.02em] text-[#BACBC9]">
          Login
        </h1>
        <p className="font-sans text-lg font-bold leading-[26px] tracking-[-0.01em] text-[#BACBC9]">
          Welcome back!
        </p>
      </div>

      <div className="flex flex-col gap-2">
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

        <div>
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            leadingIcon={<PasswordFieldIcon />}
            trailingIcon={
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((value) => !value)}
              >
                <EyeToggleIcon hidden={showPassword} />
              </button>
            }
          />
          <div className="mt-1 flex justify-end px-5">
            <Link
              to="/auth/reset"
              className="font-sans text-xs font-normal tracking-[0.01em] text-[#BACBC9] underline underline-offset-2"
            >
              Reset password
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-0 pt-8">
        <PressableButton
          variant="cta"
          disabled={!isValidEmail(email) || password.length < 1}
          onClick={() => finishLogin(email.trim())}
        >
          Login
        </PressableButton>

        <div className="flex items-center justify-center gap-2.5 py-5">
          <div className="h-px w-[100px] bg-[#BACBC9]/50" />
          <span className="font-sans text-base text-[#BACBC9]">Or</span>
          <div className="h-px w-[100px] bg-[#BACBC9]/50" />
        </div>

        <div className="flex flex-col gap-5">
          <OAuthButton
            provider="apple"
            onClick={() => finishLogin('apple@readygo.app')}
          >
            Continue with Apple
          </OAuthButton>
          <OAuthButton
            provider="google"
            onClick={() => finishLogin('google@readygo.app')}
          >
            Continue with Google
          </OAuthButton>
        </div>

        <p className="mt-6 text-center font-sans text-base leading-6 tracking-[-0.01em] text-[#BACBC9]">
          Don&apos;t have an account?{' '}
          <Link
            to="/auth/create"
            className="font-bold underline underline-offset-2"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
