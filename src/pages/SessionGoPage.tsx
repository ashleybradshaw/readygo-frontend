import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { PressableButton } from '../components/ui/PressableButton'
import { ToggleSwitch } from '../components/ui/ToggleSwitch'
import { ProfileOverviewCard } from '../components/session/ProfileOverviewCard'
import { SessionStatsCard } from '../components/session/SessionStatsCard'
import { ViewMapModal } from '../components/session/ViewMapModal'
import { GoaiLoader } from '../components/session/GoaiLoader'
import { showBlipWeatherFallback } from '../components/overlays/NotificationHost'
import { rebuildSession } from '../lib/session'
import { useReadyGoStore } from '../store/useReadyGoStore'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export function SessionGoPage() {
  const navigate = useNavigate()
  const session = useReadyGoStore((state) => state.activeSession)
  const currentProfile = useReadyGoStore((state) => state.currentProfile)
  const savedRoutes = useReadyGoStore((state) => state.savedRoutes)
  const weather = useReadyGoStore((state) => state.weather)
  const updateActiveSession = useReadyGoStore((state) => state.updateActiveSession)
  const startActiveSession = useReadyGoStore((state) => state.startActiveSession)
  const [mapOpen, setMapOpen] = useState(false)
  const [rebuilding, setRebuilding] = useState(false)

  useEffect(() => {
    if (!session || !currentProfile) {
      navigate('/', { replace: true })
    }
  }, [currentProfile, navigate, session])

  if (!session || !currentProfile) return null

  const rebuild = (direction: 'shorter' | 'longer') => {
    setRebuilding(true)
    showBlipWeatherFallback()
    window.setTimeout(() => {
      updateActiveSession(rebuildSession(session, direction))
      setRebuilding(false)
    }, 900)
  }

  return (
    <div className="relative flex h-full flex-col bg-rg-base-alt">
      <AppHeader
        locationLabel={weather.location}
        temperatureC={weather.temperatureC}
        condition={weather.condition}
      />

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 pb-5">
        <ProfileOverviewCard
          profile={currentProfile}
          savedRoutesCount={savedRoutes.length}
        />

        <div className="flex items-center gap-3 rounded-[10px] bg-rg-surface px-4 py-3 outline outline-1 outline-[#365466]">
          <div className="size-8 overflow-hidden rounded-full bg-gradient-to-b from-[#7CFF00] to-[#FF0000]" />
          <p className="text-sm font-bold text-rg-text">GOAI built this session.</p>
        </div>

        <div className="rounded-[10px] bg-rg-surface px-4 py-3 outline outline-1 outline-[#365466]">
          <p className="text-base font-bold text-rg-text">{session.title}</p>
        </div>

        <SessionStatsCard session={session} weather={weather} />

        <div className="grid grid-cols-2 gap-3">
          <PressableButton onClick={() => rebuild('shorter')}>
            <span className="flex items-center gap-2">
              <ChevronDown size={16} />
              Rebuild shorter
            </span>
          </PressableButton>
          <PressableButton onClick={() => rebuild('longer')}>
            <span className="flex items-center gap-2">
              <ChevronUp size={16} />
              Rebuild longer
            </span>
          </PressableButton>
        </div>

        <PressableButton onClick={() => setMapOpen(true)}>View map</PressableButton>

        <div className="flex items-center justify-between rounded-[10px] bg-rg-surface px-4 py-3 outline outline-1 outline-[#365466]">
          <span className="text-sm font-bold text-rg-text">
            Show map while app is open
          </span>
          <ToggleSwitch
            label="Show map while app is open"
            checked={session.showMapWhileOpen}
            onChange={(checked) =>
              updateActiveSession({ showMapWhileOpen: checked })
            }
          />
        </div>
      </div>

      <div className="px-5 pb-6">
        <PressableButton
          className="bg-[#7CFF00] text-rg-text-on-accent hover:bg-rg-lime"
          onClick={() => {
            startActiveSession()
            navigate('/session/active')
          }}
        >
          GO
        </PressableButton>
      </div>

      <ViewMapModal
        open={mapOpen}
        session={session}
        onClose={() => setMapOpen(false)}
      />
      <GoaiLoader
        open={rebuilding}
        statusLines={['Adjusting your route...', 'Rechecking distance...']}
        intervalMs={450}
      />
    </div>
  )
}
