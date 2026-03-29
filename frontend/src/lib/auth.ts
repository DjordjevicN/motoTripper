import { useMemo } from 'react'

import { useAuth } from '@/components/auth/useAuth'
import type { User } from '@/types'

export const useCurrentAppUser = (users: User[] = []) => {
  const { authUser } = useAuth()

  return useMemo(() => {
    const email = authUser?.email?.trim().toLowerCase()

    if (!email) {
      return null
    }

    return (
      users.find((user) => user.email?.trim().toLowerCase() === email) ?? null
    )
  }, [authUser?.email, users])
}
