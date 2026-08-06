import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { PressableButton } from '../ui/PressableButton'
import { SettingsCloseButton } from '../settings/SettingsCloseButton'
import {
  GridFeatureIcon,
  ListCardIcon,
  PathFeatureIcon,
} from '../ui/BasecampIcons'

interface ProfileInstructionsModalProps {
  open: boolean
  onClose: () => void
  onContinue: () => void
}

const featureCards = [
  {
    title: 'Your Way',
    body: "We'll ask what you want from your sessions – time, terrain, pace, weather. Answer once, ReadyGo remembers.",
    icon: ListCardIcon,
  },
  {
    title: 'The Planning',
    body: "Your answers shape every session. Prefer the sun, say no to drizzle – it's your session, your way.",
    icon: PathFeatureIcon,
  },
  {
    title: 'Switch It Up',
    body: 'Not happy with your profile? You can create multiple profiles or edit saved ones any time.',
    icon: GridFeatureIcon,
  },
]

export function ProfileInstructionsModal({
  open,
  onClose,
  onContinue,
}: ProfileInstructionsModalProps) {
  const frame =
    typeof document !== 'undefined'
      ? document.querySelector('[data-device-frame]')
      : null

  const overlay = (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-instructions-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-[80] flex flex-col bg-[#0F1918] px-5 pb-8 pt-[max(2.5rem,env(safe-area-inset-top))]"
        >
          <div className="mb-6 flex justify-end">
            <SettingsCloseButton variant="onDark" onClick={onClose} />
          </div>

          <div className="mb-6 flex flex-col gap-[5px] uppercase text-[#BACBC9]">
            <h2
              id="profile-instructions-title"
              className="font-display text-2xl font-bold leading-8 tracking-[-0.02em]"
            >
              Before we begin
            </h2>
            <p className="font-sans text-lg font-bold leading-[26px] tracking-[-0.01em]">
              Answer some questions and &apos;Go&apos;
            </p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto">
            {featureCards.map(({ title, body, icon: Icon }) => (
              <div
                key={title}
                className="flex gap-3 rounded border border-[#39484A] bg-[#182629] p-[16.5px]"
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-[2px] bg-[#365466]">
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold capitalize leading-5 tracking-[-1px] text-[#BACBC9]">
                    {title}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-[#BACBC9]/80">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 shrink-0">
            <PressableButton variant="cta" onClick={onContinue}>
              Questions and Go
            </PressableButton>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )

  if (!frame) return overlay
  return createPortal(overlay, frame)
}
