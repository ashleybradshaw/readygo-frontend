import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RouteMap } from '../components/session/RouteMap'
import { WaypointList } from '../components/session/WaypointList'
import { PressableButton } from '../components/ui/PressableButton'
import { formatWeatherLine, mapsDeepLinks } from '../lib/session'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function GuestMapPreviewPage() {
  const navigate = useNavigate()
  const session = useReadyGoStore((state) => state.activeSession)
  const weather = useReadyGoStore((state) => state.weather)

  useEffect(() => {
    if (!session) navigate('/guest/session-ready', { replace: true })
  }, [navigate, session])

  if (!session) return null

  const links = mapsDeepLinks(session)

  return (
    <div className="flex h-full flex-col bg-[#0F1918]">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-4">
        <RouteMap
          session={session}
          weatherLine={formatWeatherLine(weather)}
          onClose={() => navigate(-1)}
        />

        <div className="mt-4 rounded-[16px] bg-[#182629] p-4">
          <div className="mb-3 flex justify-center">
            <div className="h-1 w-10 rounded-full bg-[#BACBC9]/35" />
          </div>
          <WaypointList
            waypoints={session.waypoints}
            estimatedLabel="[00:00]"
            durationLabel={`${(session.estimatedMinutes / 60).toFixed(1)}HR`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pb-6">
        <PressableButton
          onClick={() =>
            window.open(links.apple, '_blank', 'noopener,noreferrer')
          }
          className="rounded-full border-0"
          style={{
            height: 52,
            borderRadius: 999,
            backgroundColor: '#BACBC9',
            color: '#0F1918',
            fontWeight: 700,
          }}
        >
          Apple Maps
        </PressableButton>
        <PressableButton
          onClick={() =>
            window.open(links.google, '_blank', 'noopener,noreferrer')
          }
          className="rounded-full border-0"
          style={{
            height: 52,
            borderRadius: 999,
            backgroundColor: '#BACBC9',
            color: '#0F1918',
            fontWeight: 700,
          }}
        >
          Google Maps
        </PressableButton>
      </div>
    </div>
  )
}
