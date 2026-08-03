import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AppHeader } from './AppHeader'
import { BottomNav } from './BottomNav'
import { SessionLengthSheet } from './session/SessionLengthSheet'
import { GoaiLoader } from './session/GoaiLoader'
import { buildSessionManifest } from '../lib/session'
import { showBlipWeatherFallback } from './overlays/NotificationHost'
import { useReadyGoStore, type ActiveTab } from '../store/useReadyGoStore'

function tabFromPath(pathname: string): ActiveTab {
  if (pathname.startsWith('/saved')) return 'saved'
  if (pathname.startsWith('/settings')) return 'settings'
  return 'basecamp'
}

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const setActiveTab = useReadyGoStore((state) => state.setActiveTab)
  const isConfigured = useReadyGoStore((state) => state.isConfigured)
  const currentProfile = useReadyGoStore((state) => state.currentProfile)
  const weather = useReadyGoStore((state) => state.weather)
  const oneTimeSessionHours = useReadyGoStore((state) => state.oneTimeSessionHours)
  const sessionMenuOpen = useReadyGoStore((state) => state.sessionMenuOpen)
  const setSessionMenuOpen = useReadyGoStore((state) => state.setSessionMenuOpen)
  const beginSessionBuild = useReadyGoStore((state) => state.beginSessionBuild)
  const markSessionReady = useReadyGoStore((state) => state.markSessionReady)
  const [gathering, setGathering] = useState(false)

  useEffect(() => {
    setActiveTab(tabFromPath(location.pathname))
  }, [location.pathname, setActiveTab])

  const startReadyFlow = () => {
    if (!currentProfile) return
    const session = buildSessionManifest({
      profile: currentProfile,
      weather,
      hours: oneTimeSessionHours,
    })
    beginSessionBuild(session)
    setSessionMenuOpen(false)
    setGathering(true)
    showBlipWeatherFallback()
    window.setTimeout(() => {
      markSessionReady()
      setGathering(false)
      navigate('/session')
    }, 2800)
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-rg-base-alt">
      <AppHeader
        onMenuClick={
          isConfigured && location.pathname === '/'
            ? () => setSessionMenuOpen(true)
            : undefined
        }
      />
      <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
        <Outlet />
      </main>
      <BottomNav />

      <SessionLengthSheet
        open={sessionMenuOpen}
        onClose={() => setSessionMenuOpen(false)}
        onReady={startReadyFlow}
      />
      <GoaiLoader open={gathering} />
    </div>
  )
}
