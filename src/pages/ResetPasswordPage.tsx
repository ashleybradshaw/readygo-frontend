import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { PressableButton } from '../components/ui/PressableButton'
import { TextField } from '../components/ui/TextField'
import { showSuccessToast } from '../components/overlays/NotificationHost'
import { isValidEmail } from '../lib/onboarding'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div className="flex h-full flex-col bg-rg-base-alt px-5 pb-8 pt-12">
      <h1 className="font-display text-3xl font-bold uppercase tracking-[-0.02em] text-rg-text">
        Reset password
      </h1>
      <p className="mt-2 text-sm text-rg-text-muted">
        Enter your email and we&apos;ll send a reset link. No bother if it takes
        a minute to arrive.
      </p>

      <div className="mt-8">
        <TextField
          label="Email Address"
          type="email"
          placeholder="Use your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          leadingIcon={<Mail size={18} />}
        />
      </div>

      <div className="mt-auto flex flex-col gap-3">
        {sent ? (
          <p className="text-center text-sm font-bold text-rg-success">
            Reset link sent. Check your inbox.
          </p>
        ) : null}
        <PressableButton
          disabled={!isValidEmail(email)}
          onClick={() => {
            setSent(true)
            showSuccessToast(
              'Password reset sent',
              'Check your inbox for the reset link.',
            )
            window.setTimeout(() => navigate('/auth/login'), 1200)
          }}
        >
          Send reset link
        </PressableButton>
        <Link
          to="/auth/login"
          className="text-center text-sm font-bold text-rg-text-muted underline underline-offset-2"
        >
          Back to login
        </Link>
      </div>
    </div>
  )
}
