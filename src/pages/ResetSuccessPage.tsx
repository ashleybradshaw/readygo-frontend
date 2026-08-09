import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { SuccessCheckIcon } from '../components/ui/AuthIcons'

export function ResetSuccessPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex h-full flex-col bg-[#0F1918] px-5 pb-8 pt-[max(3.5rem,env(safe-area-inset-top))]">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <SuccessCheckIcon />
        <h1 className="mt-5 font-display text-2xl font-bold uppercase leading-9 tracking-[-0.02em] text-[#BACBC9]">
          Successful
        </h1>
        <p className="mt-2 max-w-[280px] font-sans text-base leading-relaxed text-[#BACBC9]">
          Your login details have been updated. Sign in to pick up where you
          left off.
        </p>
      </div>

      <PressableButton
        variant="cta"
        onClick={() => navigate('/auth/login', { replace: true })}
        className="rounded-[4px]"
        style={{ borderRadius: 4 }}
      >
        Sign in
      </PressableButton>
    </div>
  )
}
