import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { RouteMap } from '../components/session/RouteMap'
import { WaypointList } from '../components/session/WaypointList'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function SessionActivePage() {
  const navigate = useNavigate()
  const session = useReadyGoStore((state) => state.activeSession)
  const finishActiveSession = useReadyGoStore((state) => state.finishActiveSession)

  useEffect(() => {
    if (!session) navigate('/', { replace: true })
  }, [navigate, session])

  if (!session) return null

  return (
    <div className="flex h-full flex-col bg-rg-base-alt px-4 pt-4 pb-5">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
        <RouteMap
          session={session}
          showEndHold
          onEndHold={() => {
            finishActiveSession()
            navigate('/user/summary')
          }}
        />

        <div className="rounded-[16px] bg-rg-surface p-4 outline outline-1 outline-[#365466]">
          <div className="mb-2 flex justify-center">
            <div className="h-1 w-10 rounded-full bg-white/20" />
          </div>
          <WaypointList
            waypoints={session.waypoints}
            estimatedLabel="[00:00]"
            durationLabel={`${(session.estimatedMinutes / 60).toFixed(1)}HR`}
          />
        </div>
      </div>

      <div className="pt-3">
        <PressableButton>Share</PressableButton>
      </div>
    </div>
  )
}
