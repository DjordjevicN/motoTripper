import type { MockUser } from '@/types'

export const mockUser: MockUser = {
  id: 'user-1',
  firstName: 'Nikola',
  lastName: 'Djordjevic',
  email: 'nikola@example.com',
  avatar: 'https://i.pravatar.cc/160?img=14',
  preferredCurrency: 'USD',
  location: {
    label: 'Dorcol, Belgrade',
    coordinates: {
      lat: 44.8232,
      lng: 20.4597,
    },
  },
}
