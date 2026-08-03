import { AnimatePresence, motion } from 'framer-motion'
import type { SessionManifest } from '../../store/useReadyGoStore'
import { formatDuration, formatWeatherLine, mapsDeepLinks } from '../../lib/session'
import { useReadyGoStore } from '../../store/useReadyGoStore'
import { PressableButton } from '../ui/PressableButton'
import { RouteMap } from './RouteMap'
import { WaypointList } from './WaypointList'

interface ViewMapModalProps {
  open: boolean
  session: SessionManifest
  onClose: () => void
}

export function ViewMapModal({ open, session, onClose }: ViewMapModalProps) {
  const weather = useReadyGoStore((state) => state.weather)
  const links = mapsDeepLinks(session)

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col bg-rg-base-alt"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-5">
            <RouteMap
              session={session}
              weatherLine={formatWeatherLine(weather)}
              onClose={onClose}
            />

            <div className="mt-4 rounded-[16px] bg-rg-surface p-4 outline outline-1 outline-[#365466]">
              <WaypointList
                waypoints={session.waypoints}
                estimatedLabel="[00:00]"
                durationLabel={`${(session.estimatedMinutes / 60).toFixed(1)}HR`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 px-4 pb-6">
            <PressableButton
              onClick={() => window.open(links.apple, '_blank', 'noopener,noreferrer')}
            >
              Apple Maps
            </PressableButton>
            <PressableButton
              onClick={() => window.open(links.google, '_blank', 'noopener,noreferrer')}
            >
              Google Maps
            </PressableButton>
          </div>
          <p className="sr-only">
            Estimated duration {formatDuration(session.estimatedMinutes)}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
