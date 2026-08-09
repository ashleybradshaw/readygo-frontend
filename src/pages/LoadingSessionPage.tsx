import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalLoadingScreen } from '../components/ui/GlobalLoadingScreen'
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
    <GlobalLoadingScreen
      ariaLabel="Continue to active session"
      advanceMs={1500}
      onAdvance={() => {
        startActiveSession()
        navigate('/user/session-active', { replace: true })
      }}
    />
  )
}
