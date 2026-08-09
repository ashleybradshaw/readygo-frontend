import { useNavigate } from 'react-router-dom'
import { SignOutSheet } from '../components/settings/SignOutSheet'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function LogoutPage() {
  const navigate = useNavigate()
  const signOut = useReadyGoStore((state) => state.signOut)

  return (
    <SignOutSheet
      open
      onClose={() => navigate('/settings', { replace: true })}
      onConfirm={() => {
        signOut()
        navigate('/welcome', { replace: true })
      }}
    />
  )
}
