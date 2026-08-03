import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { TextField } from '../components/ui/TextField'
import { NameCaptureSheet } from '../components/onboarding/NameCaptureSheet'
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
  const [nameOpen, setNameOpen] = useState(false)

  const emailError =
    emailTouched && email && !isValidEmail(email)
      ? 'Use a valid email address'
      : undefined

  const finishLogin = (nextEmail: string) => {
    setUserEmail(nextEmail)
    if (!userName) {
      setNameOpen(true)
      return
    }
    setAuthenticated(true)
    showSuccessToast('Login updated', 'Welcome back.')
    navigate('/')
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-rg-base-alt px-5 pb-8 pt-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold uppercase tracking-[-0.02em] text-rg-text">
          Login
        </h1>
        <p className="mt-1 text-lg font-bold uppercase text-rg-text">
          Welcome back!
        </p>
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

        <div>
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
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
          <div className="mt-2 flex justify-end">
            <Link
              to="/auth/reset"
              className="text-sm font-bold text-rg-text-muted underline underline-offset-2"
            >
              Reset password
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <PressableButton
          disabled={!isValidEmail(email) || password.length < 1}
          onClick={() => finishLogin(email.trim())}
        >
          Login
        </PressableButton>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-rg-text-dim/40" />
          <span className="text-xs font-bold text-rg-text-dim">Or</span>
          <div className="h-px flex-1 bg-rg-text-dim/40" />
        </div>

        <PressableButton
          variant="secondary"
          onClick={() => finishLogin('apple@readygo.app')}
        >
          Continue with Apple
        </PressableButton>
        <PressableButton
          variant="secondary"
          onClick={() => finishLogin('google@readygo.app')}
        >
          Continue with Google
        </PressableButton>

        <p className="text-center text-sm font-bold text-rg-text-muted">
          Don&apos;t have an account?{' '}
          <Link to="/auth/create" className="underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>

      <NameCaptureSheet
        open={nameOpen}
        onComplete={() => {
          setAuthenticated(true)
          showSuccessToast('Login updated', 'Welcome back.')
          navigate('/')
        }}
      />
    </div>
  )
}
