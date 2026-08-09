import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AppHeader } from './AppHeader'
import { BottomNav } from './BottomNav'
import { BasecampMenuModal } from './session/BasecampMenuModal'
import { showSuccessToast } from './overlays/NotificationHost'
import { useReadyGoStore, type ActiveTab } from '../store/useReadyGoStore'

function tabFromPath(pathname: string): ActiveTab {
  if (pathname.startsWith('/settings/saved') || pathname.startsWith('/saved')) {
    return 'saved'
  }
  if (pathname.startsWith('/settings')) return 'settings'
  return 'basecamp'
}

export function AppShell() {
  const location = useLocation()
  const setActiveTab = useReadyGoStore((state) => state.setActiveTab)
  const isConfigured = useReadyGoStore((state) => state.isConfigured)
  const activeSession = useReadyGoStore((state) => state.activeSession)
  const sessionMenuOpen = useReadyGoStore((state) => state.sessionMenuOpen)
  const setSessionMenuOpen = useReadyGoStore((state) => state.setSessionMenuOpen)

  useEffect(() => {
    setActiveTab(tabFromPath(location.pathname))
  }, [location.pathname, setActiveTab])

  const handleMenuSave = () => {
    setSessionMenuOpen(false)
    showSuccessToast('Saved', 'Next route length updated for this session.')
  }

  const isSettings = location.pathname === '/settings'
  const isBasecamp = location.pathname === '/user/basecamp'

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-rg-base-alt">
      {isSettings ? (
        <div className="shrink-0 pt-[max(1.25rem,env(safe-area-inset-top))]" />
      ) : (
        <AppHeader
          showWeather={Boolean(isConfigured || !isBasecamp)}
          dryHours={
            isConfigured && isBasecamp
              ? activeSession?.weatherStableHours ?? 3
              : undefined
          }
          showMenu={Boolean(isConfigured && isBasecamp)}
          onMenuClick={
            isConfigured && isBasecamp
              ? () => setSessionMenuOpen(true)
              : undefined
          }
        />
      )}
      <main
        className={`min-h-0 flex-1 overflow-y-auto pb-4 ${
          isSettings ? 'px-5' : 'px-5'
        }`}
      >
        <Outlet />
      </main>
      <BottomNav />

      <BasecampMenuModal
        open={sessionMenuOpen}
        onClose={() => setSessionMenuOpen(false)}
        onReady={handleMenuSave}
      />
    </div>
  )
}
