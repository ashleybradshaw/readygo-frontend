import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useReadyGoStore } from '../../store/useReadyGoStore'

export function RequireAuth() {
  const isAuthenticated = useReadyGoStore((state) => state.isAuthenticated)
  const isGuest = useReadyGoStore((state) => state.isGuest)
  const location = useLocation()

  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/welcome" replace state={{ from: location }} />
  }

  return <Outlet />
}

export function RequireAccount() {
  const isAuthenticated = useReadyGoStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace state={{ from: location }} />
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
