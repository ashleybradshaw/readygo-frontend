import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { TextField } from '../components/ui/TextField'
import { ProfileFieldIcon } from '../components/ui/AuthIcons'
import { pickFallbackName } from '../lib/onboarding'
import { useReadyGoStore } from '../store/useReadyGoStore'
import successHero from '../assets/auth/success-hero.jpg'

const normalizeHandle = (value: string) => {
  const cleaned = value.replace(/^@+/, '').replace(/[^a-zA-Z0-9_]/g, '')
  return cleaned.slice(0, 20)
}

export function HandleClaimPage() {
  const navigate = useNavigate()
  const setUserName = useReadyGoStore((state) => state.setUserName)
  const setAuthenticated = useReadyGoStore((state) => state.setAuthenticated)
  const promoteGuestToAccount = useReadyGoStore(
    (state) => state.promoteGuestToAccount,
  )
  const isGuest = useReadyGoStore((state) => state.isGuest)
  const [handle, setHandle] = useState('')

  const finish = (nextHandle: string, destination: string) => {
    const cleaned = normalizeHandle(nextHandle) || pickFallbackName()
    setUserName(`@${cleaned}`)

    if (isGuest) {
      promoteGuestToAccount()
    } else {
      setAuthenticated(true)
    }

    navigate(destination, { replace: true })
  }

  const displayValue = handle ? `@${handle}` : ''

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-[#0F1918] px-5 pb-8 pt-[max(2rem,env(safe-area-inset-top))]">
      <div className="relative mb-5 h-[220px] w-full shrink-0 overflow-hidden rounded-[10px]">
        <img
          src={successHero}
          alt=""
          className="absolute inset-0 size-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1918]/80 via-[#0F1918]/35 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-white">
            Successful
          </h1>
          <p className="mt-2 font-sans text-base font-bold text-white">
            Your ReadyGo account is live.
          </p>
          <p className="mt-1 font-sans text-sm text-white/90">
            Now let&apos;s set you up.
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <h2 className="mb-3 font-sans text-base font-bold tracking-[-0.01em] text-[#BACBC9]">
          Claim your handle
        </h2>

        <TextField
          aria-label="Claim your handle"
          autoComplete="username"
          placeholder="@username"
          value={displayValue}
          onChange={(event) => setHandle(normalizeHandle(event.target.value))}
          leadingIcon={<ProfileFieldIcon />}
        />

        <p className="mt-3 font-sans text-sm leading-relaxed text-[#BACBC9]/80">
          This will be used for your profile and future updates like local
          leaderboards, group segments, and friends.
        </p>

        <div className="mt-auto flex flex-col items-center gap-3 pt-8">
          <PressableButton
            variant="cta"
            disabled={handle.length < 3}
            onClick={() => finish(handle, '/user/location-activity')}
            className="rounded-[4px]"
            style={{ borderRadius: 4 }}
          >
            Save & Continue
          </PressableButton>
          <button
            type="button"
            tabIndex={0}
            aria-label="Skip for now — Set in Settings"
            onClick={() => finish(pickFallbackName(), '/user/basecamp-setup')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                finish(pickFallbackName(), '/user/basecamp-setup')
              }
            }}
            className="px-5 py-2 font-sans text-sm font-bold tracking-[-0.01em] text-[#BACBC9] underline underline-offset-2"
          >
            Skip for now — Set in Settings
          </button>
        </div>
      </div>
    </div>
  )
}
