import { updateUserService } from '@/services/userService'

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

describe('updateUser (unit)', () => {
  const validId = "A2Samf1692oOAFq12479lopt97yIO"
  const emptyId = ""
  const validUserData = {
    money: 5,
    experience: 5,
  }
  const emptyUserData = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns false when user id is empty', async () => {
    const result = await updateUserService(validId, validUserData)
    expect(result).toBeFalsy()
  })

  it('returns false when user data is empty', async () => {
    ;(getDocs as jest.Mock).mockResolvedValueOnce({ empty: true })
    const result = await updateUserService(userId)
    expect(result).toBeFalsy()
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
