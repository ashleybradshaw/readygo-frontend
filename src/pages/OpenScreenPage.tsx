import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DotMatrixLoader } from '../components/ui/DotMatrixLoader'
import readyGoMark from '../assets/readygo-mark.svg'

export function OpenScreenPage() {
  const navigate = useNavigate()
  const [exiting, setExiting] = useState(false)
  const navigatedRef = useRef(false)

  const goToIntro = () => {
    if (exiting) return
    setExiting(true)
    window.setTimeout(() => {
      if (navigatedRef.current) return
      navigatedRef.current = true
      navigate('/intro')
    }, 300)
  }

  return (
    <motion.button
      type="button"
      aria-label="Continue to intro"
      onClick={goToIntro}
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex h-full w-full cursor-pointer flex-col items-center border-0 bg-[#0F1918] p-0 text-left outline-none"
    >
      <div className="flex flex-1 items-center justify-center px-8">
        <img
          src={readyGoMark}
          alt="ReadyGo"
          width={189}
          height={123}
          className="h-auto w-[189px] select-none"
          draggable={false}
        />
      </div>

      <div className="flex shrink-0 justify-center pb-[100px]">
        <DotMatrixLoader size={49} dotSize={6} />
      </div>
    </motion.button>
  )
}
