import type { MockUser } from '@/types'

export const mockUser: MockUser = {
  id: 'user-1',
  firstName: 'Nikola',
  lastName: 'Djordjevic',
  email: 'nikola@example.com',
  avatar: 'https://i.pravatar.cc/160?img=14',
  preferredCurrency: 'USD',
  location: {
    label: 'LoDo, Denver',
    coordinates: {
      lat: 39.7528,
      lng: -104.9962,
    },
  },
}
