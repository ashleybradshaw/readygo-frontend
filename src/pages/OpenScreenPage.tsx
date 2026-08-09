import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DotMatrixLoader } from '../components/ui/DotMatrixLoader'
import { useReadyGoStore } from '../store/useReadyGoStore'
import readyGoMark from '../assets/readygo-mark.svg'

const AUTO_ADVANCE_MS = 1800

export function OpenScreenPage() {
  const navigate = useNavigate()
  const isAuthenticated = useReadyGoStore((state) => state.isAuthenticated)
  const [exiting, setExiting] = useState(false)
  const navigatedRef = useRef(false)

  const handleContinue = () => {
    if (navigatedRef.current || exiting) return
    setExiting(true)
    window.setTimeout(() => {
      if (navigatedRef.current) return
      navigatedRef.current = true
      navigate(isAuthenticated ? '/user/basecamp' : '/welcome', {
        replace: true,
      })
    }, 300)
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigatedRef.current = true
      navigate('/user/basecamp', { replace: true })
      return
    }

    const timer = window.setTimeout(() => {
      handleContinue()
    }, AUTO_ADVANCE_MS)

    return () => {
      window.clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-once auto-advance
  }, [isAuthenticated, navigate])

  if (isAuthenticated) return null

  return (
    <motion.button
      type="button"
      aria-label="Continue to welcome"
      tabIndex={0}
      onClick={handleContinue}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleContinue()
        }
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex h-full w-full cursor-pointer flex-col items-center border-0 bg-[#0F1918] p-0 text-left outline-none"
    >
      <div className="flex flex-1 flex-col items-center justify-start pt-[22%]">
        <img
          src={readyGoMark}
          alt="ReadyGo"
          width={189}
          height={123}
          className="h-auto w-[160px] select-none"
          draggable={false}
        />
      </div>

      <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center font-display text-sm font-bold uppercase tracking-widest text-[#BACBC9]">
        Take it out on the road
      </p>

      <div className="flex shrink-0 justify-center pb-[100px]">
        <DotMatrixLoader size={49} dotSize={6} />
      </div>
    </motion.button>
  )
}
