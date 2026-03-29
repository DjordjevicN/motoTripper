import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/components/auth/useAuth'

const RequireAuth = () => {
  const location = useLocation()
  const { authUser, isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-[1600px] py-8">
        Checking your rider session...
      </main>
    )
  }

  if (!authUser) {
    const next = `${location.pathname}${location.search}`

    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />
  }

  return <Outlet />
}

export default RequireAuth
