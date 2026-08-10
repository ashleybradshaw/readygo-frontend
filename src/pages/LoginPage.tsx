import { useState } from 'react'
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
import { showSuccessToast } from '../components/overlays/NotificationHost'
import { isValidEmail } from '../lib/onboarding'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function LoginPage() {
  const navigate = useNavigate()
  const setUserEmail = useReadyGoStore((state) => state.setUserEmail)
  const setAuthenticated = useReadyGoStore((state) => state.setAuthenticated)
  const setAuthMethod = useReadyGoStore((state) => state.setAuthMethod)
  const exitGuestMode = useReadyGoStore((state) => state.exitGuestMode)
  const userName = useReadyGoStore((state) => state.userName)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)

  const emailError =
    emailTouched && email && !isValidEmail(email)
      ? 'Use a valid email address'
      : undefined

  const finishLogin = (
    nextEmail: string,
    method: 'email' | 'apple' | 'google' = 'email',
  ) => {
    setUserEmail(nextEmail)
    setAuthMethod(method)
    exitGuestMode()

    if (!userName) {
      navigate('/auth/handle-claim')
      return
    }

    setAuthenticated(true)
    showSuccessToast('Login updated', 'Welcome back.')
    navigate('/user/basecamp', { replace: true })
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

      <div className="mb-8 flex flex-col gap-[5px] uppercase">
        <h1 className="font-display text-2xl font-bold leading-8 tracking-[-0.02em] text-[#BACBC9]">
          Login
        </h1>
        <p className="font-sans text-lg font-bold leading-[26px] tracking-[-0.01em] text-[#BACBC9]">
          Welcome Back!
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
                tabIndex={0}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((value) => !value)}
              >
                <EyeToggleIcon hidden={showPassword} />
              </button>
            }
          />
          <div className="mt-1 flex justify-end px-1">
            <Link
              to="/auth/reset-password"
              className="font-sans text-xs font-normal tracking-[0.01em] text-[#BACBC9] underline underline-offset-2"
            >
              Reset password
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col pt-8">
        <div className="flex w-full flex-col items-center gap-5 pt-4 pb-6">
          <div className="flex w-full flex-col gap-5">
            <PressableButton
              variant="cta"
              disabled={!isValidEmail(email) || password.length < 1}
              onClick={() => finishLogin(email.trim())}
              className="rounded-[4px]"
              style={{ borderRadius: 4 }}
            >
              Login
            </PressableButton>

            <div className="flex items-center justify-center gap-2.5">
              <div className="h-px w-[100px] bg-[#BACBC9]/50" />
              <span className="font-sans text-base text-[#BACBC9]">Or</span>
              <div className="h-px w-[100px] bg-[#BACBC9]/50" />
            </div>

            <OAuthButton
              provider="apple"
              onClick={() => finishLogin('apple@readygo.app', 'apple')}
            >
              Continue with Apple
            </OAuthButton>
            <OAuthButton
              provider="google"
              onClick={() => finishLogin('google@readygo.app', 'google')}
            >
              Continue with Google
            </OAuthButton>
          </div>

          <button
            type="button"
            tabIndex={0}
            aria-label="Don't have an account? Sign up"
            onClick={() => navigate('/auth/terms')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                navigate('/auth/terms')
              }
            }}
            className="cursor-pointer py-1 text-sm font-medium text-[#BACBC9] transition-colors hover:text-white"
          >
            Don&apos;t have an account?{' '}
            <span className="font-semibold text-white underline">Sign up</span>
          </button>
        </div>
      </div>
    </div>
  )
}
