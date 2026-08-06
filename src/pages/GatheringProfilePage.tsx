import { useNavigate } from 'react-router-dom'
import { GatheringLoaderScreen } from '../components/ui/GatheringLoaderScreen'

export function GatheringProfilePage() {
  const navigate = useNavigate()

  return (
    <GatheringLoaderScreen
      ariaLabel="Continue to review profile"
      onAdvance={() => navigate('/setup/review', { replace: true })}
    />
  )
}
