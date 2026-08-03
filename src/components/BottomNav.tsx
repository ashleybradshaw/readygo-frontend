import { Home, Settings, Trophy } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReadyGoStore, type ActiveTab } from '../store/useReadyGoStore'

const tabs: {
  id: ActiveTab
  label: string
  to: string
  icon: typeof Home
}[] = [
  { id: 'basecamp', label: 'Basecamp', to: '/', icon: Home },
  { id: 'saved', label: 'Saved', to: '/saved', icon: Trophy },
  { id: 'settings', label: 'Settings', to: '/settings', icon: Settings },
]

export function BottomNav() {
  const setActiveTab = useReadyGoStore((state) => state.setActiveTab)

  return (
    <nav
      className="flex shrink-0 items-center justify-center gap-[50px] bg-rg-base-alt px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
      aria-label="Primary"
    >
      {tabs.map(({ id, label, to, icon: Icon }) => (
        <NavLink
          key={id}
          to={to}
          end={to === '/'}
          onClick={() => setActiveTab(id)}
          className="flex w-[61px] flex-col items-center gap-1 no-underline"
        >
          {({ isActive }) => (
            <motion.div
              className="flex flex-col items-center gap-1"
              whileTap={{ scale: 0.97 }}
            >
              <Icon
                size={28}
                strokeWidth={isActive ? 2.25 : 1.75}
                className={isActive ? 'text-rg-active' : 'text-rg-text-muted/50'}
                aria-hidden
              />
              <span
                className={`text-center text-xs font-bold uppercase leading-5 tracking-[-1px] ${
                  isActive ? 'text-rg-active' : 'text-rg-text-muted/50'
                }`}
              >
                {label}
              </span>
            </motion.div>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
