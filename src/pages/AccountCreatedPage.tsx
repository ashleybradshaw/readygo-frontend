import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { TextField } from '../components/ui/TextField'
import {
  LocationFieldIcon,
  ProfileFieldIcon,
} from '../components/ui/AuthIcons'
import {
  UserNameModal,
  cycleDisplayName,
} from '../components/onboarding/UserNameModal'
import { pickFallbackName } from '../lib/onboarding'
import { useReadyGoStore } from '../store/useReadyGoStore'
import successHero from '../assets/auth/success-hero.jpg'

export function AccountCreatedPage() {
  const navigate = useNavigate()
  const setUserName = useReadyGoStore((state) => state.setUserName)
  const setAuthenticated = useReadyGoStore((state) => state.setAuthenticated)
  const updateDraftPreferences = useReadyGoStore(
    (state) => state.updateDraftPreferences,
  )

  const [name, setName] = useState('')
  const [postcode, setPostcode] = useState('')
  const [confirmedName, setConfirmedName] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const saveName = (nextName: string) => {
    const trimmed = nextName.trim()
    if (!trimmed) return
    setUserName(trimmed)
    if (postcode.trim()) {
      updateDraftPreferences({
        postcode: postcode.trim().toUpperCase(),
        locationMode: 'postcode',
      })
    }
    setConfirmedName(trimmed)
    setName(trimmed)
    setModalOpen(true)
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-[#0F1918] px-5 pb-8 pt-[70px]">
      <div className="relative mb-2.5 h-[287px] w-full shrink-0 overflow-hidden rounded-[10px]">
        <img
          src={successHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{
            backgroundImage:
              'linear-gradient(128deg, rgb(186, 203, 201) 10.88%, rgb(93, 101, 100) 88.28%)',
          }}
        />
        <div className="relative flex h-full flex-col items-center justify-center gap-[5px] px-6 text-center">
          <h1 className="font-display text-2xl font-bold uppercase leading-10 tracking-[-0.01em] text-[#BACBC9]">
            Successful
          </h1>
          <p className="font-sans text-lg font-bold leading-6 tracking-[-0.01em] text-[#BACBC9]">
            Your ReadyGo account is live.
          </p>
          <p className="font-sans text-lg leading-6 tracking-[-0.01em] text-[#BACBC9]">
            Now let&apos;s set up how you train.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <TextField
          label="What shall I call you?"
          placeholder="Type your name or nickname"
          value={name}
          onChange={(event) => setName(event.target.value)}
          hint="If you don't use your name, you can use a nickname or even make one up."
          leadingIcon={<ProfileFieldIcon />}
        />

        <TextField
          label="Location"
          placeholder="Type your post code (Optional)"
          value={postcode}
          onChange={(event) => setPostcode(event.target.value)}
          hint="ReadyGo needs a starting point to build your route. Use your current GPS, set a home location, or drop a postcode."
          leadingIcon={<LocationFieldIcon />}
        />

        <div className="mt-auto flex flex-col items-center gap-1 pt-6">
          <PressableButton
            variant="cta"
            disabled={!name.trim()}
            onClick={() => saveName(name)}
          >
            Save
          </PressableButton>

          <button
            type="button"
            onClick={() => saveName(pickFallbackName(name))}
            className="px-5 py-5 font-sans text-base font-bold tracking-[-0.01em] text-[#BACBC9] underline underline-offset-2"
          >
            Skip – pick one for me
          </button>
        </div>
      </div>

      <UserNameModal
        open={modalOpen}
        userName={confirmedName}
        onClose={() => setModalOpen(false)}
        onPickAnother={() => {
          const next = cycleDisplayName(confirmedName)
          setConfirmedName(next)
          setName(next)
          setUserName(next)
        }}
        onBasecamp={() => {
          setAuthenticated(true)
          navigate('/')
        }}
      />
    </div>
  )
}
