import { MapPinned, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { useReadyGoStore } from '../store/useReadyGoStore'
import iconPoor from '../assets/feedback/rating-icon-poor-1.svg'
import iconBad from '../assets/feedback/rating-icon-bad-1.svg'
import iconOk from '../assets/feedback/rating-icon-ok-1.svg'
import iconGood from '../assets/feedback/rating-icon-good-1.svg'
import iconFine from '../assets/feedback/rating-icon-fine-1.svg'

const SENTIMENTS = [
  { value: 1, src: iconPoor, label: 'Very bad' },
  { value: 2, src: iconBad, label: 'Bad' },
  { value: 3, src: iconOk, label: 'Okay' },
  { value: 4, src: iconGood, label: 'Good' },
  { value: 5, src: iconFine, label: 'Very good' },
]

const ratingIconClass = (active: boolean) =>
  active
    ? 'size-10 opacity-100 [filter:brightness(0)_saturate(100%)_invert(78%)_sepia(64%)_saturate(1015%)_hue-rotate(47deg)_brightness(103%)_contrast(106%)_drop-shadow(0_0_8px_rgba(112,255,0,0.6))]'
    : 'size-10 opacity-50 grayscale'

const formatGuestDuration = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.round(totalMinutes % 60)
  if (hours <= 0) return `${minutes}min`
  if (minutes === 0) return `${hours}hr`
  return `${hours}hr ${minutes}min`
}

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
  const distanceValue = `${session.distanceMiles} Mi`
  const timeValue = formatGuestDuration(session.estimatedMinutes)
  const startFinishValue = `${session.startLocation} To ${session.endLocation}`

  const metrics = [
    { label: 'Distance:', value: distanceValue },
    { label: 'Time:', value: timeValue },
    { label: 'Pace:', value: avgPace },
    { label: 'Start/Finish:', value: startFinishValue },
  ]

  return (
    <div className="relative flex h-full flex-col bg-[#0F1918] px-5 pt-10 pb-6">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-white">
          Session Complete
        </h1>
        <p className="mt-1 text-base font-bold uppercase tracking-[-0.01em] text-[#BACBC9]/80">
          Great work out there.
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
        <section className="rounded-[4px] bg-[#182629] p-4">
          <h2 className="border-b border-[#39484A] pb-3 text-base font-semibold text-white">
            {session.title}
          </h2>
          <div className="mt-3 flex items-start gap-3">
            <MapPinned
              size={18}
              className="mt-0.5 shrink-0 text-[#BACBC9]"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1 space-y-1.5">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-baseline justify-between gap-3 text-sm tracking-[-0.01em]"
                >
                  <span className="shrink-0 text-[#BACBC9]">{metric.label}</span>
                  <span className="min-w-0 text-right font-semibold text-white">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[4px] bg-[#182629] p-4 text-center">
          <h2 className="font-display text-base font-bold uppercase tracking-[-0.01em] text-white">
            Unlock Full Performance
          </h2>
          <p className="mt-2 font-sans text-sm leading-relaxed text-[#BACBC9]">
            Sign up in 10 seconds to save this{' '}
            <span className="font-bold text-[#70FF00]">{distanceLabel}</span> route,
            track your 30-day streak, and unlock 7-day weather windows.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              tabIndex={0}
              aria-label="Create Free Account"
              onClick={() => navigate('/auth/terms')}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  navigate('/auth/terms')
                }
              }}
              className="flex h-11 flex-1 items-center justify-center whitespace-nowrap rounded-[4px] bg-[#C5A059] px-4 text-sm font-bold text-[#0F1918]"
            >
              Create Free Account
            </button>
            <button
              type="button"
              tabIndex={0}
              aria-label="View Map"
              onClick={() => navigate('/guest/map-preview')}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  navigate('/guest/map-preview')
                }
              }}
              className="flex h-11 flex-1 items-center justify-center whitespace-nowrap rounded-[4px] bg-[#BACBC9]/20 px-4 text-sm font-medium text-[#BACBC9]"
            >
              View Map
            </button>
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
                return (
                  <button
                    key={item.value}
                    type="button"
                    tabIndex={0}
                    aria-label={item.label}
                    aria-pressed={active}
                    onClick={() => setSentiment(item.value)}
                    className="flex flex-1 flex-col items-center gap-1 py-1"
                  >
                    <img
                      src={item.src}
                      alt=""
                      aria-hidden="true"
                      className={ratingIconClass(active)}
                    />
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
