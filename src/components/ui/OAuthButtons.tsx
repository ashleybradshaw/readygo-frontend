import type { ReactNode } from 'react'
import { PressableButton } from './PressableButton'

interface OAuthButtonProps {
  provider: 'apple' | 'google'
  onClick: () => void
  children: ReactNode
}

export function OAuthButton({ onClick, children }: OAuthButtonProps) {
  return (
    <PressableButton
      variant="ghost"
      onClick={onClick}
      whileTap={{ scale: 1 }}
      className="!no-underline hover:!no-underline rounded-[4px] border border-[#2D3739] bg-transparent text-[#BACBC9] active:bg-[#1E2729]"
      style={{
        height: 52,
        borderRadius: 4,
        textDecoration: 'none',
      }}
    >
      <span className="font-action text-base font-bold tracking-[0.15px]">
        {children}
      </span>
    </PressableButton>
  )
}
