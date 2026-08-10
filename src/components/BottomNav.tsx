import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Trophy, Settings, type LucideIcon } from 'lucide-react'
import { useReadyGoStore, type ActiveTab } from '../store/useReadyGoStore'

const tabs: {
  id: ActiveTab
  label: string
  to: string
  icon: LucideIcon
}[] = [
  { id: 'basecamp', label: 'Basecamp', to: '/user/basecamp', icon: Home },
  { id: 'saved', label: 'Saved', to: '/settings/saved-sessions', icon: Trophy },
  { id: 'settings', label: 'Settings', to: '/settings', icon: Settings },
]

const isTabActive = (pathname: string, to: string) => {
  if (to === '/user/basecamp') {
    return (
      pathname === '/user/basecamp' || pathname === '/user/basecamp-empty'
    )
  }
  if (to === '/settings/saved-sessions') {
    return (
      pathname.startsWith('/settings/saved') || pathname.startsWith('/saved')
    )
  }
  if (to === '/settings') {
    return pathname === '/settings'
  }
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const setActiveTab = useReadyGoStore((state) => state.setActiveTab)

  return (
    <nav
      className="flex shrink-0 items-center justify-center gap-[50px] bg-[#0F1918] px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
      aria-label="Primary"
    >
      {tabs.map(({ id, label, to, icon: Icon }) => {
        const isActive = isTabActive(location.pathname, to)

        const handleClick = () => {
          setActiveTab(id)
          navigate(to)
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
            whileTap={{ scale: 0.92 }}
            className={`flex w-[61px] flex-col items-center gap-0.5 bg-transparent transition-colors ${
              isActive
                ? 'text-[#70FF00]'
                : 'text-[#BACBC9]/60 hover:text-white'
            }`}
          >
            <span
              className={`relative flex size-10 items-center justify-center rounded-full p-2 ${
                isActive ? 'bg-[#BACBC9]/15 text-[#70FF00]' : ''
              }`}
            >
              {isActive ? (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 rounded-full bg-[#BACBC9]/15"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  aria-hidden="true"
                />
              ) : null}
              <Icon
                className="relative z-10 h-5 w-5"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </span>
            <span
              className={`text-center text-xs uppercase leading-5 tracking-[-1px] ${
                isActive ? 'font-semibold text-[#70FF00]' : 'font-bold'
              }`}
            >
              {label}
            </span>
          </motion.button>
        )
      })}
    </nav>
  )
}
