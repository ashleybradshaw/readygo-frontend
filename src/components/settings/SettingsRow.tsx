import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface SettingsRowProps {
  label: string
  onClick?: () => void
  icon?: ReactNode
  tone?: 'default' | 'amber' | 'danger'
}

export function SettingsRow({
  label,
  onClick,
  icon,
  tone = 'default',
}: SettingsRowProps) {
  const tones = {
    default: 'bg-rg-surface text-rg-text outline-[#365466]',
    amber: 'bg-[#141210] text-rg-amber outline-[#5A4630]',
    danger: 'bg-[#1A1012] text-[#FF8A80] outline-[#5A3036]',
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-[12px] px-4 py-3.5 text-left outline outline-1 ${tones[tone]}`}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="min-w-0 flex-1 text-sm font-bold">{label}</span>
      <ChevronRight size={16} className="shrink-0 opacity-70" />
    </motion.button>
  )
}
