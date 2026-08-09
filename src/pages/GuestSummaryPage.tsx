import { MapPinned, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RatingIconBad,
  RatingIconFine,
  RatingIconGood,
  RatingIconOk,
  RatingIconPoor,
} from '../components/feedback/RatingIcons'
import { PressableButton } from '../components/ui/PressableButton'
import { formatDuration } from '../lib/session'
import { useReadyGoStore } from '../store/useReadyGoStore'

const SENTIMENTS = [
  { value: 1, Icon: RatingIconBad, label: 'Very bad' },
  { value: 2, Icon: RatingIconPoor, label: 'Bad' },
  { value: 3, Icon: RatingIconOk, label: 'Okay' },
  { value: 4, Icon: RatingIconGood, label: 'Good' },
  { value: 5, Icon: RatingIconFine, label: 'Very good' },
]

export function GuestSummaryPage() {
  const navigate = useNavigate()
  const session = useReadyGoStore((state) => state.activeSession)
  const [sentiment, setSentiment] = useState(4)
  const [feedbackOpen, setFeedbackOpen] = useState(true)

  useEffect(() => {
    if (!session) navigate('/guest/basecamp', { replace: true })
  }, [navigate, session])

  const avgPace = useMemo(() => {
    if (!session || session.distanceMiles <= 0) return '7:20'
    const minutesPerMile = session.estimatedMinutes / session.distanceMiles
    const mins = Math.floor(minutesPerMile)
    const secs = Math.round((minutesPerMile - mins) * 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [session])

  if (!session) return null

  const distanceLabel = `${session.distanceMiles} mi`

  return (
    <div className="relative flex h-full flex-col bg-[#0F1918] px-5 pt-10 pb-6">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-[#BACBC9]">
          Session Complete
        </h1>
        <p className="mt-1 text-base font-bold uppercase tracking-[-0.01em] text-[#BACBC9]/80">
          Great work out there.
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
        <section className="rounded-[4px] bg-[#182629] p-4">
          <h2 className="border-b border-[#39484A] pb-3 text-base font-bold tracking-[-0.01em] text-[#BACBC9]">
            {session.title}
          </h2>
          <div className="mt-3 flex items-start gap-3">
            <MapPinned
              size={18}
              className="mt-0.5 shrink-0 text-[#BACBC9]"
              aria-hidden="true"
            />
            <div className="space-y-1.5 text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
              <p>
                Distance:{' '}
                <span className="text-[#BACBC9]/80">{session.distanceMiles} Mi</span>
              </p>
              <p>
                Start/Finish:{' '}
                <span className="text-[#BACBC9]/80">
                  {session.startLocation} To {session.endLocation}
                </span>
              </p>
              <p>
                Time:{' '}
                <span className="text-[#BACBC9]/80">
                  {formatDuration(session.estimatedMinutes)}
                </span>
              </p>
              <p>
                Avg Mile:{' '}
                <span className="text-[#BACBC9]/80">{avgPace}</span>
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[4px] bg-[#182629] p-4 text-center">
          <h2 className="font-display text-base font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
            Unlock Full Performance
          </h2>
          <p className="mt-2 font-sans text-sm leading-relaxed text-[#BACBC9]">
            Sign up in 10 seconds to save this{' '}
            <span className="font-bold text-[#70FF00]">{distanceLabel}</span> route,
            track your 30-day streak, and unlock 7-day weather windows.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <PressableButton
              onClick={() => navigate('/auth/terms')}
              className="rounded-[4px] border-0 px-4 py-3 text-sm whitespace-nowrap"
              style={{
                minHeight: 48,
                height: 'auto',
                borderRadius: 4,
                backgroundColor: '#B59473',
                color: '#0F1918',
                fontWeight: 700,
              }}
            >
              Create Free Account
            </PressableButton>
            <PressableButton
              onClick={() => navigate('/guest/map-preview')}
              className="rounded-[4px] border-0 px-4 py-3 text-sm whitespace-nowrap"
              style={{
                minHeight: 48,
                height: 'auto',
                borderRadius: 4,
                backgroundColor: '#BACBC9',
                color: '#0F1918',
                fontWeight: 700,
              }}
            >
              View Map
            </PressableButton>
          </div>
        </section>

        {feedbackOpen ? (
          <section className="relative rounded-[4px] bg-[#1A1524] p-4">
            <button
              type="button"
              tabIndex={0}
              aria-label="Close feedback"
              onClick={() => setFeedbackOpen(false)}
              className="absolute right-3 top-3 text-[#BACBC9]/70"
            >
              <X size={16} aria-hidden="true" />
            </button>
            <h2 className="pr-6 text-base font-bold text-[#BACBC9]">
              How Well Did You Enjoy Your Session?
            </h2>
            <p className="mt-1 text-sm text-[#BACBC9]/70">
              This helps us improve the app.
            </p>
            <div className="mt-4 flex items-end justify-between gap-2">
              {SENTIMENTS.map((item) => {
                const active = sentiment === item.value
                const Icon = item.Icon
                return (
                  <button
                    key={item.value}
                    type="button"
                    tabIndex={0}
                    aria-label={item.label}
                    aria-pressed={active}
                    onClick={() => setSentiment(item.value)}
                    className="flex flex-1 flex-col items-center gap-1 rounded-[4px] py-1"
                  >
                    <Icon active={active} className="size-10" />
                  </button>
                )
              })}
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-bold text-[#BACBC9]/70">
              <span>Very bad</span>
              <span>Very good</span>
            </div>
          </section>
        ) : null}
      </div>

      <div className="pt-3">
        <PressableButton
          onClick={() => navigate('/guest/basecamp', { replace: true })}
          className="rounded-[4px] border-0"
          style={{
            height: 52,
            borderRadius: 4,
            backgroundColor: '#2D3739',
            color: '#BACBC9',
            fontWeight: 700,
          }}
        >
          Basecamp
        </PressableButton>
      </div>
    </div>
  )
}
