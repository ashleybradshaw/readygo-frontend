import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AppHeader } from './AppHeader'
import { BottomNav } from './BottomNav'
import { BasecampMenuModal } from './session/BasecampMenuModal'
import { buildSessionManifest } from '../lib/session'
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

  useEffect(() => {
    setActiveTab(tabFromPath(location.pathname))
  }, [location.pathname, setActiveTab])

  const handleMenuReady = () => {
    if (!currentProfile) return
    const session = buildSessionManifest({
      profile: currentProfile,
      weather,
      hours: oneTimeSessionHours,
    })
    beginSessionBuild(session)
    setSessionMenuOpen(false)
    navigate('/session/gathering')
  }

  const isAdminSurface =
    location.pathname === '/settings' || location.pathname === '/saved'

  return (
    <div
      className={`relative flex h-full min-h-0 flex-col ${
        isAdminSurface ? 'bg-[#DCE4E2]' : 'bg-rg-base-alt'
      }`}
    >
      {isAdminSurface ? (
        <div className="shrink-0 pt-[max(1.25rem,env(safe-area-inset-top))]" />
      ) : (
        <AppHeader
          showWeather={Boolean(isConfigured || location.pathname !== '/')}
          showMenu={Boolean(isConfigured && location.pathname === '/')}
          onMenuClick={
            isConfigured && location.pathname === '/'
              ? () => setSessionMenuOpen(true)
              : undefined
          }
        />
      )}
      <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
        <Outlet />
      </main>
      <BottomNav />

      <BasecampMenuModal
        open={sessionMenuOpen}
        onClose={() => setSessionMenuOpen(false)}
        onReady={handleMenuReady}
      />
    </div>
  )
}
