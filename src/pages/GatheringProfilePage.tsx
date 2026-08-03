import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { showProfileSavedModal } from '../components/overlays/NotificationHost'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function GatheringProfilePage() {
  const navigate = useNavigate()
  const draft = useReadyGoStore((state) => state.profileDraft)
  const editingProfileId = useReadyGoStore((state) => state.editingProfileId)
  const completeProfileSetup = useReadyGoStore(
    (state) => state.completeProfileSetup,
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const profileName =
        draft.name.trim() ||
        (draft.activityType === 'Cycle' ? 'Cycle Profile One' : 'Run Profile One')

      completeProfileSetup({
        id: editingProfileId ?? crypto.randomUUID(),
        name: profileName,
        activityType: draft.activityType,
        timesUsed:
          useReadyGoStore
            .getState()
            .savedProfiles.find((item) => item.id === editingProfileId)
            ?.timesUsed ?? 0,
        preferences: { ...draft.preferences },
      })
      showProfileSavedModal()
      navigate('/', { replace: true })
    }, 2400)

    return () => window.clearTimeout(timer)
  }, [completeProfileSetup, draft, editingProfileId, navigate])

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-rg-base-alt">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(255,59,48,0.25),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(ellipse_at_bottom,rgba(124,255,0,0.2),transparent_70%)]" />

      <div className="mb-10 flex items-center font-display text-3xl font-semibold tracking-tight text-rg-text-muted uppercase">
        <span>Ready</span>
        <span className="relative mx-1 inline-flex h-8 w-8 items-center justify-center">
          <span className="absolute h-[3px] w-7 rotate-[-28deg] rounded-full bg-rg-red" />
          <span className="absolute h-[3px] w-7 translate-y-[6px] rotate-[-28deg] rounded-full bg-rg-amber" />
          <span className="absolute h-[3px] w-7 translate-y-[12px] rotate-[-28deg] rounded-full bg-[#7CFF00]" />
        </span>
        <span>Go</span>
      </div>

      <div className="flex items-center gap-3">
        <DotRow colour="bg-rg-red" delay={0} />
        <div className="flex items-center gap-2 rounded-full bg-rg-surface px-3 py-2">
          <motion.div
            className="size-5 overflow-hidden rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
          >
            <div className="h-full w-1/2 bg-rg-amber" />
            <div className="ml-auto h-full w-1/2 bg-[#7CFF00]" />
          </motion.div>
          <span className="text-sm font-bold tracking-wide text-rg-text uppercase">
            GOAI
          </span>
        </div>
        <DotRow colour="bg-[#7CFF00]" delay={0.15} />
      </div>

      <p className="mt-8 text-sm font-bold text-rg-text-muted">
        Gathering your profile…
      </p>
    </div>
  )
}

function DotRow({ colour, delay }: { colour: string; delay: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 4 }).map((_, index) => (
        <motion.span
          key={index}
          className={`size-2 rounded-full ${colour}`}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            delay: delay + index * 0.12,
          }}
        />
      ))}
    </div>
  )
}
