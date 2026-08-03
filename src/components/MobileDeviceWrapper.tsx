import type { ReactNode } from 'react'

interface MobileDeviceWrapperProps {
  children: ReactNode
}

/**
 * Centres a phone-width frame on desktop; goes full-bleed on mobile viewports.
 */
export function MobileDeviceWrapper({ children }: MobileDeviceWrapperProps) {
  return (
    <div className="flex min-h-full w-full justify-center bg-rg-base-deep sm:items-center sm:p-6 sm:bg-[radial-gradient(ellipse_at_center,#162026_0%,#080c0e_70%)]">
      <div
        className="relative flex h-dvh w-full max-w-none flex-col overflow-hidden bg-rg-base-alt sm:h-[min(852px,calc(100dvh-3rem))] sm:max-w-[393px] sm:rounded-[2rem] sm:border sm:border-white/10 sm:shadow-[0_25px_80px_rgba(0,0,0,0.55)]"
        data-device-frame
      >
        {children}
      </div>
    </div>
  )
}
