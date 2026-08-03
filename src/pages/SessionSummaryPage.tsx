import { Award, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { SessionStatsCard } from '../components/session/SessionStatsCard'
import { ViewMapModal } from '../components/session/ViewMapModal'
import { SaveSessionModal } from '../components/session/SaveSessionModal'
import { useReadyGoStore } from '../store/useReadyGoStore'

const SENTIMENTS = [
  { value: 1, emoji: '😠', label: 'Very bad' },
  { value: 2, emoji: '😕', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Very good' },
]

export function SessionSummaryPage() {
  const navigate = useNavigate()
  const session = useReadyGoStore((state) => state.activeSession)
  const weather = useReadyGoStore((state) => state.weather)
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

  if (!session) return null

  return (
    <div className="relative flex h-full flex-col bg-rg-base-alt px-5 pt-10 pb-6">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-rg-text">
          Session finished
        </h1>
        <p className="mt-1 text-base font-bold uppercase text-rg-text-muted">
          Save it or head back to Basecamp.
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
        <div className="flex items-center gap-3 rounded-[10px] bg-rg-surface px-4 py-3 outline outline-1 outline-[#30D158]/50">
          <Award size={18} className="text-[#30D158]" />
          <p className="text-sm font-bold text-rg-text">Session Completed</p>
        </div>

        <SessionStatsCard
          session={session}
          weather={weather}
          showWeatherNote={false}
        />

        <div className="grid grid-cols-2 gap-3">
          <PressableButton
            disabled={alreadySaved}
            onClick={() => {
              saveCompletedSession(sentiment)
              setAlreadySaved(true)
              setSavedOpen(true)
            }}
          >
            {alreadySaved ? 'Saved' : 'Save session'}
          </PressableButton>
          <PressableButton onClick={() => setMapOpen(true)}>
            View map
          </PressableButton>
        </div>

        {feedbackOpen ? (
          <section className="relative rounded-[16px] bg-[#1A1524] p-4 outline outline-1 outline-[#365466]">
            <button
              type="button"
              aria-label="Close feedback"
              onClick={() => setFeedbackOpen(false)}
              className="absolute top-3 right-3 text-rg-text-muted"
            >
              <X size={16} />
            </button>
            <h2 className="pr-6 text-base font-bold text-rg-text">
              How well did you enjoy your session?
            </h2>
            <p className="mt-1 text-sm text-rg-text-muted">
              This helps us improve the app.
            </p>
            <div className="mt-4 flex items-end justify-between gap-2">
              {SENTIMENTS.map((item) => {
                const active = sentiment === item.value
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSentiment(item.value)}
                    className={`flex flex-1 flex-col items-center gap-1 rounded-[10px] py-2 ${
                      active
                        ? 'bg-[#7CFF00]/20 outline outline-1 outline-[#7CFF00]'
                        : ''
                    }`}
                  >
                    <span
                      className={`text-2xl ${active ? '' : 'grayscale opacity-50'}`}
                    >
                      {item.emoji}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-bold text-rg-text-muted">
              <span>Very bad</span>
              <span>Very good</span>
            </div>
          </section>
        ) : null}
      </div>

      <div className="pt-3">
        <PressableButton
          onClick={() => {
            clearSession()
            navigate('/')
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
        onBasecamp={() => {
          setSavedOpen(false)
          clearSession()
          navigate('/')
        }}
      />
    </div>
  )
}
