import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftCircle } from 'lucide-react'
import { PressableButton } from '../components/ui/PressableButton'
import { showSuccessToast } from '../components/overlays/NotificationHost'
import { useReadyGoStore } from '../store/useReadyGoStore'

const normalizeHandle = (value: string) => {
  const cleaned = value.replace(/@+/g, '').replace(/[^a-zA-Z0-9_]/g, '')
  return cleaned.slice(0, 20)
}

export function ChangeHandlePage() {
  const navigate = useNavigate()
  const userName = useReadyGoStore((state) => state.userName)
  const setUserName = useReadyGoStore((state) => state.setUserName)
  const existing = userName.replace(/^@+/, '')
  const [handle, setHandle] = useState(existing)

  const canSave = handle.length >= 3 && handle !== existing

  const handleBack = () => {
    navigate('/settings')
  }

  const handleSave = () => {
    if (!canSave) return
    setUserName(`@${handle}`)
    showSuccessToast('Handle updated', `@${handle} is now yours.`)
    navigate('/settings', { replace: true })
  }

  return (
    <div className="relative flex h-full flex-col bg-[#0F1918] px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-8">
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

      <div className="mt-10 mb-8">
        <h1 className="font-display text-2xl font-bold tracking-[-0.02em] text-[#BACBC9] uppercase">
          Change Handle
        </h1>
        <p className="mt-1 font-sans text-base font-bold tracking-[-0.01em] text-[#BACBC9] uppercase">
          Create your new handel
        </p>
      </div>

      <label className="flex w-full flex-col gap-2">
        <span className="font-sans text-sm font-bold text-[#BACBC9]">
          Your current handle
        </span>
        <div className="flex h-[52px] items-center gap-3 rounded-[4px] border border-[#2D3739] bg-[#182629] px-4">
          <span
            className="font-sans text-base font-bold text-[#BACBC9]"
            aria-hidden="true"
          >
            @
          </span>
          <input
            type="text"
            value={handle}
            onChange={(event) => setHandle(normalizeHandle(event.target.value))}
            placeholder="username"
            aria-label="Your current handle"
            autoComplete="username"
            className="min-w-0 flex-1 bg-transparent font-sans text-base font-bold text-[#BACBC9] outline-none placeholder:text-[#BACBC9]/50"
          />
        </div>
      </label>

      <p className="mt-3 font-sans text-sm leading-relaxed text-[#BACBC9]/80">
        This will be used for your profile and future updates like local
        leaderboards, group segments, and friends.
      </p>

      <div className="mt-auto">
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
