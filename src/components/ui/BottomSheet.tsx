import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  tone?: 'dark' | 'light'
}

export function BottomSheet({
  open,
  onClose,
  children,
  tone = 'light',
}: BottomSheetProps) {
  return (
    <AnimatePresence>
      {open ? (
        <div className="absolute inset-0 z-50 flex items-end justify-center">
          <motion.button
            type="button"
            aria-label="Dismiss"
            className="absolute inset-0 bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose()
            }}
            className={`relative z-10 flex max-h-[88%] w-full flex-col rounded-t-[28px] ${
              tone === 'light'
                ? 'bg-rg-sheet text-rg-text-on-accent'
                : 'bg-rg-base-alt text-rg-text'
            }`}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div
                className={`h-1 w-10 rounded-full ${
                  tone === 'light' ? 'bg-rg-text-on-accent/25' : 'bg-white/20'
                }`}
              />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
              {children}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
