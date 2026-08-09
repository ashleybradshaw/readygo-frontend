import { useNavigate } from 'react-router-dom'
import { GlobalLoadingScreen } from '../components/ui/GlobalLoadingScreen'
import { showSuccessToast } from '../components/overlays/NotificationHost'

export function GatheringProfilePage() {
  const navigate = useNavigate()

  return (
    <GlobalLoadingScreen
      ariaLabel="Saving profile"
      advanceMs={1500}
      onAdvance={() => {
        showSuccessToast('Profile saved', 'Your Smart Window is ready.')
        navigate('/', { replace: true })
      }}
    />
  )
}
