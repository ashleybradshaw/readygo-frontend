import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GatheringLoaderScreen } from '../components/ui/GatheringLoaderScreen'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function GatheringSessionPage() {
  const navigate = useNavigate()
  const markSessionReady = useReadyGoStore((state) => state.markSessionReady)
  const activeSession = useReadyGoStore((state) => state.activeSession)

  useEffect(() => {
    if (!activeSession) {
      navigate('/', { replace: true })
    }
  }, [activeSession, navigate])

  if (!activeSession) return null

  return (
    <GatheringLoaderScreen
      ariaLabel="Continue to session"
      onAdvance={() => {
        markSessionReady()
        navigate('/session/go', { replace: true })
      }}
    />
  )
}
