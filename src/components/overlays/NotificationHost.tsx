import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useReadyGoStore,
  type AppNotification,
  type NotificationTone,
} from '../../store/useReadyGoStore'
import { FullScreenOverlay } from './FullScreenOverlay'
import {
  ErrorBadgeIcon,
  LocationBadgeIcon,
  SuccessBadgeIcon,
  WeatherBadgeIcon,
} from './OverlayBadges'
import { SupportSheet } from './SupportSheet'

const overlayIcon = (tone: NotificationTone) => {
  if (tone === 'success') return <SuccessBadgeIcon />
  if (tone === 'weather') return <WeatherBadgeIcon />
  if (tone === 'location') return <LocationBadgeIcon />
  return <ErrorBadgeIcon />
}

export function NotificationHost() {
  const notifications = useReadyGoStore((state) => state.notifications)
  const dismissNotification = useReadyGoStore((state) => state.dismissNotification)
  const navigate = useNavigate()
  const [supportOpen, setSupportOpen] = useState(false)

  const toasts = notifications.filter((item) => item.kind === 'toast')
  const modals = notifications.filter((item) => item.kind === 'modal')
  const activeModal = modals[modals.length - 1]

  const handleLabelAction = (label: string, modal: AppNotification) => {
    const normalised = label.toLowerCase()
    dismissNotification(modal.id)

    if (normalised.includes('help')) {
      setSupportOpen(true)
      return
    }
    if (normalised.includes('basecamp')) {
      navigate('/')
      return
    }
    if (normalised.includes('postcode') || normalised.includes('another')) {
      navigate('/user/location-activity')
      return
    }
    if (normalised.includes('sign in')) {
      navigate('/auth/login')
    }
  }

  return (
    <>
      <div className="pointer-events-none absolute inset-x-3 top-3 z-[70] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`pointer-events-auto rounded-[14px] px-4 py-3 shadow-lg outline outline-1 ${
                toast.tone === 'success'
                  ? 'bg-[#13261A] text-[#7CFF00] outline-[#7CFF00]/40'
                  : 'bg-rg-surface text-rg-text outline-[#365466]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{toast.title}</p>
                  {toast.body ? (
                    <p className="mt-1 text-xs text-rg-text-muted">{toast.body}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  aria-label="Dismiss"
                  onClick={() => dismissNotification(toast.id)}
                  className="text-rg-text-muted"
                >
                  <X size={14} />
                </button>
              </div>
              <AutoDismiss id={toast.id} ms={4200} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {activeModal ? (
        <FullScreenOverlay
          key={activeModal.id}
          open
          headingId={`overlay-${activeModal.id}`}
          icon={overlayIcon(activeModal.tone)}
          heading={activeModal.title}
          bodyTitle={activeModal.body}
          bodySub={activeModal.subtitle}
          primaryLabel={activeModal.primaryLabel}
          onPrimary={
            activeModal.primaryLabel
              ? () => handleLabelAction(activeModal.primaryLabel!, activeModal)
              : undefined
          }
          secondaryLabel={activeModal.secondaryLabel}
          onSecondary={
            activeModal.secondaryLabel
              ? () => handleLabelAction(activeModal.secondaryLabel!, activeModal)
              : undefined
          }
        />
      ) : null}

      <SupportSheet open={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  )
}

function AutoDismiss({ id, ms }: { id: string; ms: number }) {
  const dismissNotification = useReadyGoStore((state) => state.dismissNotification)
  useEffect(() => {
    const timer = window.setTimeout(() => dismissNotification(id), ms)
    return () => window.clearTimeout(timer)
  }, [dismissNotification, id, ms])
  return null
}

export function showBlipConnectionError() {
  useReadyGoStore.getState().pushNotification({
    kind: 'modal',
    tone: 'blip',
    title: 'BLIP!',
    body: 'Something went wrong building your session.',
    subtitle: 'Usually a connection blip. Tap below and try again.',
    primaryLabel: 'Try again',
    secondaryLabel: 'Back to Basecamp',
  })
}

export function showBlipWeatherFallback() {
  useReadyGoStore.getState().pushNotification({
    kind: 'modal',
    tone: 'weather',
    title: 'BLIP!',
    body: 'Something went wrong building your session.',
    subtitle:
      'Weather data unavailable right now. Your session has been built using recent conditions.',
    primaryLabel: 'Ok',
    secondaryLabel: 'Back to Basecamp',
  })
}

export function showBlipLocationFailed() {
  useReadyGoStore.getState().pushNotification({
    kind: 'modal',
    tone: 'location',
    title: 'BLIP!',
    body: 'No location. No bother.',
    subtitle:
      "ReadyGo works best with your location, but you can set a home postcode instead. We'll build routes from there.",
    primaryLabel: 'Set a postcode',
    secondaryLabel: 'Need help?',
  })
}

export function showOuchSystemError() {
  useReadyGoStore.getState().pushNotification({
    kind: 'modal',
    tone: 'ouch',
    title: 'OUCH!',
    body: "It's not your fault – my systems had a moment.",
    subtitle: 'Close the app and reopen it. If it keeps happening, tap below.',
    secondaryLabel: 'Need help?',
  })
}

export function showSuccessToast(title: string, body?: string) {
  useReadyGoStore.getState().pushNotification({
    kind: 'toast',
    tone: 'success',
    title,
    body,
  })
}

export function showProfileSavedModal() {
  useReadyGoStore.getState().pushNotification({
    kind: 'modal',
    tone: 'success',
    title: 'Successful',
    body: 'Your new profile was saved!',
    subtitle: 'Update anytime in Settings.',
    primaryLabel: 'Basecamp',
  })
}
