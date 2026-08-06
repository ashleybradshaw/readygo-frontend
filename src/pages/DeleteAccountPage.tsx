import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { SettingsCloseButton } from '../components/settings/SettingsCloseButton'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function DeleteAccountPage() {
  const navigate = useNavigate()
  const deleteAccount = useReadyGoStore((state) => state.deleteAccount)
  const [confirmation, setConfirmation] = useState('')
  const canDelete = confirmation.trim() === 'DELETE'

  return (
    <div className="flex h-full flex-col bg-[#DCE4E2] px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase leading-8 tracking-[-0.02em] text-[#0F1918]">
            Account
          </h1>
          <p className="mt-1 font-sans text-lg font-bold uppercase tracking-[-0.01em] text-[#0F1918]">
            Delete My Account?
          </p>
        </div>
        <SettingsCloseButton onClick={() => navigate('/settings')} />
      </div>

      <p className="font-sans text-sm font-bold uppercase leading-5 tracking-[-0.01em] text-[#0F1918]">
        We get it – life moves on. Deleting your account removes everything
        permanently. We&apos;ll send a confirmation to your email.
      </p>

      <label className="mt-8 flex w-full flex-col gap-1.5">
        <span className="font-sans text-sm text-[#0F1918]">
          To confirm, type DELETE below.
        </span>
        <input
          type="text"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          placeholder="DELETE"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Type DELETE to confirm"
          className="h-[52px] w-full rounded-xl border border-[#BACBC9]/60 bg-[#F4F8F7] px-5 font-sans text-base font-bold uppercase tracking-[-0.01em] text-[#0F1918] outline-none placeholder:text-[#829695] focus:border-[#0F1918]"
        />
      </label>

      <div className="mt-auto">
        <PressableButton
          variant="cta"
          disabled={!canDelete}
          style={{ backgroundColor: '#BC757D', color: '#0F1918' }}
          className="active:opacity-90"
          onClick={() => {
            deleteAccount()
            navigate('/intro')
          }}
        >
          Delete my account
        </PressableButton>
      </div>
    </div>
  )
}
