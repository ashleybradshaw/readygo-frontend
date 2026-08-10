import type { ReactNode } from 'react'

type SetupSectionProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export const SetupSection = ({
  title,
  subtitle,
  children,
}: SetupSectionProps) => (
  <section className="mb-[10px] flex w-full flex-col items-start rounded-[4px] border border-[#2D3739]/60 bg-[#182629]/40 p-4 text-left">
    <h3 className="text-sm font-bold tracking-wider text-[#BACBC9] uppercase">
      {title}
    </h3>
    {subtitle ? (
      <p className="mt-1 text-xs text-[#BACBC9]/70">{subtitle}</p>
    ) : null}
    <div className="mt-2 w-full">{children}</div>
  </section>
)
