import { useNavigate } from 'react-router-dom'
import { PressableButton } from '../components/ui/PressableButton'
import { useReadyGoStore } from '../store/useReadyGoStore'
import welcomeHero from '../assets/intro/welcome-hero.png.jpg'

export function WelcomeEntryPage() {
  const navigate = useNavigate()
  const enterGuestMode = useReadyGoStore((state) => state.enterGuestMode)
  const setHasSeenIntro = useReadyGoStore((state) => state.setHasSeenIntro)

  const handleGuest = () => {
    setHasSeenIntro(true)
    enterGuestMode()
    navigate('/guest/activity')
  }

  const handleSignup = () => {
    setHasSeenIntro(true)
    navigate('/auth/terms')
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#0F1918]">
      <div className="relative h-[42vh] w-full shrink-0 overflow-hidden">
        <img
          src={welcomeHero}
          alt=""
          className="absolute inset-0 size-full object-cover object-top"
          draggable={false}
        />
        <p
          className="absolute top-[28%] left-1/2 -translate-x-1/2 font-display text-3xl font-black uppercase tracking-widest text-[#FF3B3B]"
          aria-hidden="true"
        >
          Ready
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-between bg-[#0F1918] px-6 pt-8">
        <div className="mx-auto w-full max-w-[360px] text-center">
          <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-[#BACBC9]">
            Nice meeting you
          </h1>
          <p className="mt-1 font-display text-sm font-bold uppercase tracking-[-0.01em] text-[#BACBC9]/80">
            Let&apos;s get ready
          </p>
          <p className="mt-4 font-sans text-sm leading-relaxed tracking-[-0.01em] text-[#BACBC9]">
            Jump straight in as a{' '}
            <span className="font-bold text-white">Guest</span> to generate your
            first instant route. Or tap{' '}
            <span className="font-bold text-white">Signup</span> to save your
            preferences, unlock your personalised{' '}
            <span className="font-bold text-white">7-day weather window</span>,
            and keep track of your history.{' '}
            <span className="font-bold text-white">Everything is free.</span>
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[360px] flex-col items-center gap-5 pt-4 pb-6">
          <div className="flex w-full gap-3">
            <PressableButton
              onClick={handleGuest}
              className="rounded-[4px] border border-[#2D3739] bg-transparent"
              style={{
                height: 52,
                borderRadius: 4,
                color: '#BACBC9',
                backgroundColor: 'transparent',
              }}
            >
              Guest
            </PressableButton>
            <PressableButton
              onClick={handleSignup}
              className="rounded-[4px] border-0"
              style={{
                height: 52,
                borderRadius: 4,
                backgroundColor: '#BACBC9',
                color: '#0F1918',
                fontWeight: 600,
              }}
            >
              Signup
            </PressableButton>
          </div>

          <button
            type="button"
            tabIndex={0}
            aria-label="Already have an account? Sign in"
            onClick={() => navigate('/auth/login')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                navigate('/auth/login')
              }
            }}
            className="cursor-pointer py-1 text-sm font-medium text-[#BACBC9] transition-colors hover:text-white"
          >
            Already have an account?{' '}
            <span className="font-semibold text-white underline">Sign in</span>
          </button>
        </div>
      </div>
    </div>
  )
}
