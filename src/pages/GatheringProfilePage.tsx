import { useNavigate } from 'react-router-dom'
import { GlobalLoadingScreen } from '../components/ui/GlobalLoadingScreen'

export function GatheringProfilePage() {
  const navigate = useNavigate()

  return (
    <GlobalLoadingScreen
      ariaLabel="Saving profile"
      advanceMs={1500}
      onAdvance={() => {
        navigate('/user/basecamp', { replace: true })
      }}
    />
  )
}
