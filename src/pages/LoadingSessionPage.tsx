import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GatheringLoaderScreen } from '../components/ui/GatheringLoaderScreen'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function LoadingSessionPage() {
  const navigate = useNavigate()
  const activeSession = useReadyGoStore((state) => state.activeSession)
  const startActiveSession = useReadyGoStore((state) => state.startActiveSession)

  useEffect(() => {
    if (!activeSession) {
      navigate('/', { replace: true })
    }
  }, [activeSession, navigate])

  if (!activeSession) return null

  return (
    <GatheringLoaderScreen
      ariaLabel="Continue to active session"
      onAdvance={() => {
        startActiveSession()
        navigate('/session/active', { replace: true })
      }}
    />
  )
}
