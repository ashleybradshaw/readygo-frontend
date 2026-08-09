import { Award, Bike, MapPinned, Network, PersonStanding, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { ViewMapModal } from '../components/session/ViewMapModal'
import { SaveSessionModal } from '../components/session/SaveSessionModal'
import { formatDuration } from '../lib/session'
import { useReadyGoStore } from '../store/useReadyGoStore'
import ratingBad from '../assets/feedback/rating-bad.png'
import ratingPoor from '../assets/feedback/rating-poor.png'
import ratingOk from '../assets/feedback/rating-ok.png'
import ratingGood from '../assets/feedback/rating-good.png'
import ratingFine from '../assets/feedback/rating-fine.png'

const SENTIMENTS = [
  { value: 1, src: ratingBad, label: 'Very bad' },
  { value: 2, src: ratingPoor, label: 'Bad' },
  { value: 3, src: ratingOk, label: 'Okay' },
  { value: 4, src: ratingGood, label: 'Good' },
  { value: 5, src: ratingFine, label: 'Very good' },
]

export function SessionSummaryPage() {
  const navigate = useNavigate()
  const session = useReadyGoStore((state) => state.activeSession)
  const currentProfile = useReadyGoStore((state) => state.currentProfile)
  const saveCompletedSession = useReadyGoStore(
    (state) => state.saveCompletedSession,
  )
  const clearSession = useReadyGoStore((state) => state.clearSession)
  const [sentiment, setSentiment] = useState(4)
  const [mapOpen, setMapOpen] = useState(false)
  const [savedOpen, setSavedOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(true)
  const [alreadySaved, setAlreadySaved] = useState(false)

  useEffect(() => {
    if (!session) navigate('/', { replace: true })
  }, [navigate, session])

  const avgPace = useMemo(() => {
    if (!session || session.distanceMiles <= 0) return '7:20'
    const minutesPerMile = session.estimatedMinutes / session.distanceMiles
    const mins = Math.floor(minutesPerMile)
    const secs = Math.round((minutesPerMile - mins) * 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [session])

  if (!session) return null

  const ActivityIcon =
    (currentProfile?.activityType ?? session.activityType) === 'Cycle'
      ? Bike
      : PersonStanding

  const goBasecamp = () => {
    clearSession()
    navigate('/', { replace: true })
  }

  return (
    <div className="relative flex h-full flex-col bg-[#0B1214] px-5 pt-10 pb-6">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-[#F5F7F7]">
          Session Complete
        </h1>
        <p className="mt-1 text-base font-bold uppercase tracking-[-0.01em] text-[#BACBC9]">
          Great work out there.
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
        <div className="flex items-center gap-3 rounded-[4px] bg-[#182629] px-4 py-3">
          <span className="inline-flex items-center gap-2 rounded-[4px] bg-[#70FF00]/15 px-2.5 py-1 text-sm font-bold text-[#70FF00]">
            <Award size={16} aria-hidden="true" />
            Session Completed
          </span>
        </div>

        <section className="rounded-[4px] bg-[#182629] p-4">
          <h2 className="border-b border-[#39484A] pb-3 text-base font-bold tracking-[-0.01em] text-[#BACBC9]">
            {session.title}
          </h2>

          <div className="mt-3 flex items-center justify-between gap-3 border-b border-[#39484A] pb-3">
            <div className="flex min-w-0 items-center gap-2">
              <ActivityIcon
                size={16}
                className="shrink-0 text-[#70FF00]"
                aria-hidden="true"
              />
              <p className="truncate text-xs font-bold text-[#BACBC9]">
                {currentProfile?.name ?? 'Active profile'}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Network size={14} className="text-[#78ABCC]" aria-hidden="true" />
              <p className="text-xs font-bold text-[#BACBC9]">
                Times used {currentProfile?.timesUsed ?? 0}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-3">
            <MapPinned
              size={18}
              className="mt-0.5 shrink-0 text-[#BACBC9]"
              aria-hidden="true"
            />
            <div className="space-y-1.5 text-sm font-bold tracking-[-0.01em] text-[#BACBC9]">
              <p>
                Distance:{' '}
                <span className="text-[#BACBC9]/80">
                  {session.distanceMiles} Mi
                </span>
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

          <div className="mt-4 grid grid-cols-2 gap-3">
            <PressableButton
              disabled={alreadySaved}
              onClick={() => {
                saveCompletedSession(sentiment)
                setAlreadySaved(true)
                setSavedOpen(true)
              }}
              className="rounded-[4px] border-0"
              style={{
                height: 40,
                borderRadius: 4,
                backgroundColor: '#A88E6D',
                color: '#0F1918',
                fontWeight: 700,
              }}
            >
              {alreadySaved ? 'Saved' : 'Save session'}
            </PressableButton>
            <PressableButton
              onClick={() => setMapOpen(true)}
              className="rounded-[4px] border-0"
              style={{
                height: 40,
                borderRadius: 4,
                backgroundColor: '#D1D9D8',
                color: '#0F1918',
                fontWeight: 700,
              }}
            >
              View map
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
                return (
                  <button
                    key={item.value}
                    type="button"
                    tabIndex={0}
                    aria-label={item.label}
                    aria-pressed={active}
                    onClick={() => setSentiment(item.value)}
                    className={`flex flex-1 flex-col items-center gap-1 rounded-[4px] py-1 ${
                      active
                        ? 'bg-[#70FF00]/15 outline outline-1 outline-[#70FF00]'
                        : ''
                    }`}
                  >
                    <img
                      src={item.src}
                      alt=""
                      aria-hidden="true"
                      className={`size-10 rounded-[4px] object-cover ${
                        active ? '' : 'opacity-55 grayscale'
                      }`}
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
          onClick={goBasecamp}
          className="rounded-[4px] border-0"
          style={{
            height: 52,
            borderRadius: 4,
            backgroundColor: '#2D3739',
            color: '#F5F7F7',
            fontWeight: 700,
          }}
        >
          Basecamp
        </PressableButton>
      </div>

      <ViewMapModal
        open={mapOpen}
        session={session}
        onClose={() => setMapOpen(false)}
      />

      <SaveSessionModal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        onBasecamp={goBasecamp}
      />
    </div>
  )
}
