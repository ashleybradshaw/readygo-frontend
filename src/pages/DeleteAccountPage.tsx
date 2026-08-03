import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { TextField } from '../components/ui/TextField'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function DeleteAccountPage() {
  const navigate = useNavigate()
  const deleteAccount = useReadyGoStore((state) => state.deleteAccount)
  const [confirmation, setConfirmation] = useState('')
  const canDelete = confirmation.trim().toLowerCase() === 'delete'

  return (
    <div className="flex h-full flex-col bg-rg-base-alt px-5 pt-10 pb-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-rg-text">
          Account
        </h1>
        <p className="mt-1 text-lg font-bold uppercase text-rg-text-muted">
          Delete my account?
        </p>
      </div>

      <p className="text-sm font-bold uppercase leading-5 text-rg-text">
        We get it – life moves on. Deleting your account removes everything
        permanently. We&apos;ll send a confirmation to your email.
      </p>

      <div className="mt-8">
        <TextField
          label="To confirm, type DELETE below."
          placeholder="DELETE"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          autoCapitalize="characters"
        />
      </div>

      <div className="mt-auto">
        <PressableButton
          disabled={!canDelete}
          className="bg-[#1A1012] text-[#FF8A80] hover:bg-[#241418]"
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
