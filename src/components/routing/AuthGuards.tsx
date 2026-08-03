import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useReadyGoStore } from '../../store/useReadyGoStore'

export function RequireAuth() {
  const isAuthenticated = useReadyGoStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/intro" replace state={{ from: location }} />
  }

  return <Outlet />
}

export function RedirectIfAuthenticated({
  children,
}: {
  children: ReactNode
}) {
  const isAuthenticated = useReadyGoStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
