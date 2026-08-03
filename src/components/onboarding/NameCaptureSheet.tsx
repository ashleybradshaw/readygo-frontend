import { MapPin, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BottomSheet } from '../ui/BottomSheet'
import { PressableButton } from '../ui/PressableButton'
import { TextField } from '../ui/TextField'
import { pickFallbackName } from '../../lib/onboarding'
import { useReadyGoStore } from '../../store/useReadyGoStore'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface NameCaptureSheetProps {
  open: boolean
  onComplete: () => void
}

export function NameCaptureSheet({ open, onComplete }: NameCaptureSheetProps) {
  const setUserName = useReadyGoStore((state) => state.setUserName)
  const updateDraftPreferences = useReadyGoStore(
    (state) => state.updateDraftPreferences,
  )
  const [name, setName] = useState('')
  const [postcode, setPostcode] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (!open) {
      setName('')
      setPostcode('')
      setConfirmed(false)
    }
  }, [open])

  const saveAndConfirm = (nextName: string) => {
    const trimmed = nextName.trim()
    if (!trimmed) return
    setUserName(trimmed)
    if (postcode.trim()) {
      updateDraftPreferences({
        postcode: postcode.trim().toUpperCase(),
        locationMode: 'postcode',
      })
    }
    setName(trimmed)
    setConfirmed(true)
  }

  return (
    <BottomSheet open={open} onClose={() => undefined} tone="dark">
      <AnimatePresence mode="wait">
        {!confirmed ? (
          <motion.div
            key="capture"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex flex-col gap-4 pt-2"
          >
            <div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-rg-text">
                Who&apos;s training?
              </h2>
              <p className="mt-1 text-sm font-bold text-rg-text-muted">
                Drop a name and optional home postcode so GOAI can greet you
                properly.
              </p>
            </div>

            <TextField
              label="Your name"
              placeholder="Type your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              leadingIcon={<UserRound size={18} />}
            />

            <TextField
              label="Home postcode (optional)"
              placeholder="Type your postcode"
              value={postcode}
              onChange={(event) => setPostcode(event.target.value)}
              leadingIcon={<MapPin size={18} />}
            />

            <PressableButton
              disabled={!name.trim()}
              onClick={() => saveAndConfirm(name)}
            >
              Continue
            </PressableButton>

            <button
              type="button"
              onClick={() => saveAndConfirm(pickFallbackName(name))}
              className="text-center text-sm font-bold text-rg-text underline underline-offset-2"
            >
              Skip – pick one for me
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 pt-4 text-center"
          >
            <div className="w-full rounded-[18px] bg-rg-surface px-5 py-8 text-rg-text outline outline-1 outline-[#365466]">
              <div className="mx-auto flex size-[60px] items-center justify-center rounded-[14px] bg-[#7CFF00] text-rg-text-on-accent">
                <Check size={28} strokeWidth={3} />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold uppercase">
                Nice meeting you
              </h2>
              <p className="mt-2 text-base font-bold">{name}</p>
              <p className="mt-1 text-sm text-rg-text-muted">
                Jump into Basecamp to continue.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = pickFallbackName(name)
                setName(next)
                setUserName(next)
              }}
              className="text-sm font-bold text-rg-text-muted underline underline-offset-2"
            >
              Pick another name
            </button>

            <PressableButton onClick={onComplete}>Basecamp</PressableButton>
          </motion.div>
        )}
      </AnimatePresence>
    </BottomSheet>
  )
}
