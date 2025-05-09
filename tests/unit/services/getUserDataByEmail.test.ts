import { getUserDataByEmail } from '@/services/userService'

jest.mock('@/firebaseConfig', () => ({
  db: {} as any,
}))

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}))

import { getDocs } from 'firebase/firestore'

describe('getUserDataByEmail (unit)', () => {
  const validEmail = 'user@example.com'
  const invalidEmail = 'not-an-email'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns null for invalid email format', async () => {
    const res = await getUserDataByEmail(invalidEmail)
    expect(res).toBeNull()
  })

  it('returns null when no user found', async () => {
    ;(getDocs as jest.Mock).mockResolvedValueOnce({ empty: true })
    const res = await getUserDataByEmail(validEmail)
    expect(res).toBeNull()
  })

  it('returns the first document data when user exists', async () => {
    const mockData = {
      id: 'u1',
      email: validEmail,
      money: 0,
      level: 1,
      experience: 0,
      lastLessonConcluded: '2025-01-01T00:00:00Z',
      notifications: true,
      pet: 'pet1',
    }
    ;(getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
      docs: [{ data: () => mockData }],
    })

    const res = await getUserDataByEmail(validEmail)
    expect(res).toEqual(mockData)
  })
})
