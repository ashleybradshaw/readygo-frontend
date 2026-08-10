import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutGroup, motion } from 'framer-motion'
import { Home, Trophy, Settings, type LucideIcon } from 'lucide-react'
import { useReadyGoStore, type ActiveTab } from '../store/useReadyGoStore'

type NavTab = {
  id: ActiveTab
  label: string
  to: string
  guestTo?: string
  icon: LucideIcon
  guestOnly?: boolean
  authOnly?: boolean
}

const tabs: NavTab[] = [
  {
    id: 'basecamp',
    label: 'Basecamp',
    to: '/user/basecamp',
    guestTo: '/guest/basecamp',
    icon: Home,
  },
  {
    id: 'saved',
    label: 'Saved',
    to: '/settings/saved-sessions',
    icon: Trophy,
    authOnly: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    to: '/settings',
    icon: Settings,
  },
]

const isTabActive = (pathname: string, tab: NavTab) => {
  if (tab.id === 'basecamp') {
    return (
      pathname === '/user/basecamp' ||
      pathname === '/user/basecamp-empty' ||
      pathname === '/user/basecamp-setup' ||
      pathname === '/guest/basecamp'
    )
  }
  if (tab.id === 'saved') {
    return (
      pathname.startsWith('/settings/saved') || pathname.startsWith('/saved')
    )
  }
  if (tab.id === 'settings') {
    return pathname === '/settings'
  }
  return pathname === tab.to || pathname.startsWith(`${tab.to}/`)
}

export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const isGuest = useReadyGoStore((state) => state.isGuest)
  const isAuthenticated = useReadyGoStore((state) => state.isAuthenticated)
  const setActiveTab = useReadyGoStore((state) => state.setActiveTab)

  const visibleTabs = tabs.filter((tab) => {
    if (isGuest && !isAuthenticated) {
      return tab.id === 'basecamp' || tab.id === 'settings'
    }
    return !tab.guestOnly
  })

  return (
    <LayoutGroup>
      <nav
        className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-around rounded-full border border-[#2D3739] bg-[#182629]/90 p-2 shadow-xl backdrop-blur-md"
        aria-label="Primary"
      >
        {visibleTabs.map((tab) => {
          const { id, label, icon: Icon } = tab
          const isActive = isTabActive(location.pathname, tab)
          const target =
            isGuest && !isAuthenticated && tab.guestTo ? tab.guestTo : tab.to

          const handleClick = () => {
            setActiveTab(id)
            navigate(target)
          }

          return (
            <motion.button
              key={id}
              type="button"
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={0}
              onClick={handleClick}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleClick()
                }
              }}
              whileTap={{ scale: 0.94 }}
              className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-full px-3 py-2 transition-colors ${
                isActive
                  ? 'text-[#70FF00]'
                  : 'text-[#BACBC9]/60 hover:text-white'
              }`}
            >
              {isActive ? (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 rounded-full border border-[#70FF00]/40 bg-[#70FF00]/15 shadow-[0_0_14px_rgba(112,255,0,0.3)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  aria-hidden="true"
                />
              ) : null}
              <Icon
                className="relative z-10 h-5 w-5"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span
                className={`relative z-10 text-center text-xs uppercase leading-5 tracking-[-1px] ${
                  isActive ? 'font-semibold' : 'font-bold'
                }`}
              >
                {label}
              </span>
            </motion.button>
          )
        })}
      </nav>
    </LayoutGroup>
  )
}
