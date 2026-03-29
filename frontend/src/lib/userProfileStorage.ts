import { CURRENT_USER_ID } from '@/lib/constants'
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

export const getResolvedCurrentUser = () => {
  return getStoredUserOverride(CURRENT_USER_ID)
}
