import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalLoadingScreen } from '../components/ui/GlobalLoadingScreen'
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
    <GlobalLoadingScreen
      ariaLabel="Continue to session"
      advanceMs={1500}
      onAdvance={() => {
        markSessionReady()
        navigate('/user/session-ready', { replace: true })
      }}
    />
  )
}
