import { mockCurrentUserId, mockUsers } from '@/data/users/mockUsers'
import type { User } from '@/types'

const STORAGE_KEY = 'mototripper_profile_overrides'

const getStorageMap = (): Record<string, Partial<User>> => {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)

    return rawValue ? (JSON.parse(rawValue) as Record<string, Partial<User>>) : {}
  } catch {
    return {}
  }
}

export const getStoredUserOverride = (userId: string) => {
  return getStorageMap()[userId]
}

export const saveStoredUserOverride = (
  userId: string,
  override: Partial<User>,
) => {
  if (typeof window === 'undefined') {
    return
  }

  const nextMap = {
    ...getStorageMap(),
    [userId]: override,
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMap))
}

export const getResolvedUser = (userId: string) => {
  const baseUser = mockUsers.find((user) => user.id === userId)

  if (!baseUser) {
    return null
  }

  return {
    ...baseUser,
    ...getStoredUserOverride(userId),
  }
}

export const getResolvedCurrentUser = () => {
  return getResolvedUser(mockCurrentUserId)
}
