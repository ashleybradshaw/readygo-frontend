import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Check, WifiOff, X } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReadyGoStore } from '../../store/useReadyGoStore'
import { PressableButton } from '../ui/PressableButton'
import { BottomSheet } from '../ui/BottomSheet'

export function NotificationHost() {
  const notifications = useReadyGoStore((state) => state.notifications)
  const dismissNotification = useReadyGoStore((state) => state.dismissNotification)
  const navigate = useNavigate()

  const toasts = notifications.filter((item) => item.kind === 'toast')
  const modals = notifications.filter((item) => item.kind === 'modal')

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
                toast.tone === 'weather'
                  ? 'bg-[#1C2A33] text-rg-text outline-[#365466]'
                  : toast.tone === 'success'
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

      {modals.map((modal) => {
        const isBlip = modal.tone === 'blip'
        const isOuch = modal.tone === 'ouch'
        const isSuccess = modal.tone === 'success'

        return (
          <BottomSheet
            key={modal.id}
            open
            onClose={() => dismissNotification(modal.id)}
            tone={isSuccess ? 'light' : 'dark'}
          >
            <div className="flex flex-col items-center gap-4 pt-2 pb-2 text-center">
              <div
                className={`w-full rounded-[18px] px-5 py-8 ${
                  isSuccess
                    ? 'bg-rg-base-alt text-rg-text'
                    : 'bg-rg-surface text-rg-text outline outline-1 outline-[#365466]'
                }`}
              >
                <div
                  className={`mx-auto flex size-[60px] items-center justify-center rounded-[14px] ${
                    isSuccess
                      ? 'bg-[#7CFF00] text-rg-text-on-accent'
                      : isOuch
                        ? 'bg-rg-red-cta text-white'
                        : 'bg-rg-amber text-rg-text-on-accent'
                  }`}
                >
                  {isSuccess ? (
                    <Check size={28} strokeWidth={3} />
                  ) : isBlip ? (
                    <WifiOff size={26} />
                  ) : (
                    <AlertTriangle size={26} />
                  )}
                </div>
                <h2 className="mt-5 font-display text-2xl font-bold uppercase">
                  {modal.title}
                </h2>
                {modal.body ? (
                  <p className="mt-2 text-sm text-rg-text-muted">{modal.body}</p>
                ) : null}
              </div>

              <div className="flex w-full flex-col gap-3">
                {modal.primaryLabel ? (
                  <PressableButton
                    variant={isSuccess ? 'sheet' : 'primary'}
                    onClick={() => {
                      dismissNotification(modal.id)
                      const label = modal.primaryLabel?.toLowerCase() ?? ''
                      if (label.includes('basecamp')) navigate('/')
                      if (label.includes('another')) navigate('/setup')
                    }}
                  >
                    {modal.primaryLabel}
                  </PressableButton>
                ) : null}
                {modal.secondaryLabel ? (
                  <PressableButton
                    variant="ghost"
                    onClick={() => {
                      dismissNotification(modal.id)
                      const label = modal.secondaryLabel?.toLowerCase() ?? ''
                      if (label.includes('basecamp')) navigate('/')
                      if (label.includes('another')) navigate('/setup')
                    }}
                  >
                    {modal.secondaryLabel}
                  </PressableButton>
                ) : null}
              </div>
            </div>
          </BottomSheet>
        )
      })}
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
    body: "Connection dropped. I'll try again when you're back online.",
    primaryLabel: 'Try again',
    secondaryLabel: 'Back to Basecamp',
  })
}

export function showBlipWeatherFallback() {
  useReadyGoStore.getState().pushNotification({
    kind: 'toast',
    tone: 'weather',
    title: 'BLIP!',
    body: 'Weather data unavailable right now. Session built using recent conditions.',
  })
}

export function showOuchSystemError() {
  useReadyGoStore.getState().pushNotification({
    kind: 'modal',
    tone: 'ouch',
    title: 'OUCH!',
    body: "It's not your fault — my systems had a moment.",
    primaryLabel: 'Back to Basecamp',
    secondaryLabel: 'Try again',
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
    body: 'Your new profile was saved! Update anytime in Settings.',
    primaryLabel: 'Basecamp',
    secondaryLabel: 'Make another one?',
  })
}
