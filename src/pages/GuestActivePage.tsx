import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RouteMap } from '../components/session/RouteMap'
import { WaypointList } from '../components/session/WaypointList'
import { PressableButton } from '../components/ui/PressableButton'
import { showSuccessToast } from '../components/overlays/NotificationHost'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function GuestActivePage() {
  const navigate = useNavigate()
  const session = useReadyGoStore((state) => state.activeSession)
  const finishActiveSession = useReadyGoStore((state) => state.finishActiveSession)

  useEffect(() => {
    if (!session) navigate('/guest/session-ready', { replace: true })
  }, [navigate, session])

  if (!session) return null

  return (
    <div className="flex h-full flex-col bg-[#0F1918] px-4 pt-4 pb-5">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
        <RouteMap
          session={session}
          showEndHold
          onEndHold={() => {
            finishActiveSession()
            navigate('/guest/summary', { replace: true })
          }}
        />

        <div className="rounded-[16px] bg-[#182629] p-4">
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

      <div className="pt-3">
        <PressableButton
          onClick={() =>
            showSuccessToast('Share', 'Sharing opens from your device share sheet.')
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
          Share
        </PressableButton>
      </div>
    </div>
  )
}
