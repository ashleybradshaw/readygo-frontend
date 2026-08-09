import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalLoadingScreen } from '../components/ui/GlobalLoadingScreen'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function GuestLoadingPage() {
  const navigate = useNavigate()
  const activeSession = useReadyGoStore((state) => state.activeSession)
  const startActiveSession = useReadyGoStore((state) => state.startActiveSession)

  useEffect(() => {
    if (!activeSession) {
      navigate('/guest/session-ready', { replace: true })
    }
  }, [activeSession, navigate])

  if (!activeSession) return null

  return (
    <GlobalLoadingScreen
      ariaLabel="Continue to active session"
      advanceMs={1500}
      onAdvance={() => {
        startActiveSession()
        navigate('/guest/active', { replace: true })
      }}
    />
  )
}
