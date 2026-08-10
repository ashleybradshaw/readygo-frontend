import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftCircle } from 'lucide-react'
import { PressableButton } from '../components/ui/PressableButton'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function DeleteAccountPage() {
  const navigate = useNavigate()
  const deleteAccount = useReadyGoStore((state) => state.deleteAccount)
  const [confirmation, setConfirmation] = useState('')
  const canDelete = confirmation.trim() === 'DELETE'

  const handleBack = () => {
    navigate('/settings')
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
        className="absolute top-6 right-6 z-20 cursor-pointer text-[#BACBC9] hover:text-white"
      >
        <ArrowLeftCircle className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="mb-6 pr-10">
        <h2 className="text-xl font-black tracking-wide text-white uppercase">
          ACCOUNT
        </h2>
        <p className="mt-1 text-xs font-bold text-[#BACBC9] uppercase">
          DELETE MY ACCOUNT?
        </p>
      </div>

      <p className="font-sans text-sm font-bold uppercase leading-5 tracking-[-0.01em] text-[#BACBC9]">
        We get it – life moves on. Deleting your account removes everything
        permanently. We&apos;ll send a confirmation to your email.
      </p>

      <label className="mt-8 flex w-full flex-col gap-1.5">
        <span className="font-sans text-sm text-[#BACBC9]">
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
          className="h-[52px] w-full rounded-[4px] border border-[#2D3739] bg-[#182629] px-5 font-sans text-base font-bold uppercase tracking-[-0.01em] text-[#BACBC9] outline-none placeholder:text-[#BACBC9]/50 focus:border-[#BACBC9]/40"
        />
      </label>

      <div className="mt-auto">
        <PressableButton
          disabled={!canDelete}
          onClick={() => {
            deleteAccount()
            navigate('/', { replace: true })
          }}
          className="rounded-[4px] border-0"
          style={{
            height: 52,
            borderRadius: 4,
            backgroundColor: '#C87A7A',
            color: '#0F1918',
            fontWeight: 700,
          }}
        >
          Delete my account
        </PressableButton>
      </div>
    </div>
  )
}
