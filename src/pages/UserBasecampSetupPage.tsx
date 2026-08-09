import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { PressableButton } from '../components/ui/PressableButton'
import {
  DocumentFeatureIcon,
  GridFeatureIcon,
  ReadyGoWordmark,
} from '../components/ui/BasecampIcons'
import { useReadyGoStore } from '../store/useReadyGoStore'
import { getCreateProfilePath } from '../lib/profileRouting'

export function UserBasecampSetupPage() {
  const navigate = useNavigate()
  const userName = useReadyGoStore((state) => state.userName)
  const guestSession = useReadyGoStore((state) => state.guestSession)
  const profileDraft = useReadyGoStore((state) => state.profileDraft)
  const handle = userName.startsWith('@')
    ? userName
    : `@${userName || 'username'}`

  const handleCompleteProfile = () => {
    navigate(getCreateProfilePath({ guestSession, profileDraft }))
  }
  return (
    <div className="relative flex h-full flex-col bg-[#0F1918]">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-4 pt-[max(2.5rem,env(safe-area-inset-top))]">
        <div className="mb-6 flex justify-center">
          <ReadyGoWordmark />
        </div>

        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-[#BACBC9]">
            Welcome
          </h1>
          <p className="mt-1 font-sans text-lg font-bold tracking-[-0.01em] text-[#BACBC9]">
            {handle}!
          </p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[#BACBC9]">
            Tell us your primary activity and location so we can forecast your
            best training days. Set up your profile to activate your 7-Day Smart
            Window.
          </p>
        </div>

        <div className="space-y-3">
          <FeatureCard
            icon={<DocumentFeatureIcon />}
            title="Your Way"
            body="We'll ask what you want from your sessions – time, terrain, pace, weather. Answer once, ReadyGo remembers."
          />
          <FeatureCard
            icon={<GridFeatureIcon />}
            title="Switch It Up"
            body="Not happy with your profile? You can create multiple profiles or edit saved ones any time."
          />
        </div>

        <div className="mt-auto pt-8">
          <PressableButton
            variant="cta"
            onClick={handleCompleteProfile}
            className="rounded-[4px]"
            style={{ borderRadius: 4 }}
          >
            Complete Profile
          </PressableButton>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

const FeatureCard = ({
  icon,
  title,
  body,
}: {
  icon: ReactNode
  title: string
  body: string
}) => (
  <section className="flex gap-3 rounded-[4px] border border-[#2D3739] bg-[#182629] p-4">
    <div className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-[#0F1918] text-[#BACBC9]">
      {icon}
    </div>
    <div>
      <h2 className="text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
        {title}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-[#BACBC9]/80">{body}</p>
    </div>
  </section>
)
