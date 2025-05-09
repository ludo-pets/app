import { getPetDataById } from '@/services/userService'

jest.mock('@/firebaseConfig', () => ({
  db: {} as any,
}))

jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(),
}))

import { getDoc } from 'firebase/firestore'

describe('getPetDataById (unit)', () => {
  const dummyRef = {} as any

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns null if the document does not exist', async () => {
    ;(getDoc as jest.Mock).mockResolvedValueOnce({ exists: () => false })
    const res = await getPetDataById(dummyRef)
    expect(res).toBeNull()
  })

  it('returns the data object when the doc exists', async () => {
    const mockPet = {
      id: 'p1',
      name: 'Fluffy',
      color: 'white',
      type: 'cat',
      purchasedItems: [{ id: 'i1', quantity: 2 }],
      activeItems: {
        bed: 'b1',
        food: 'f1',
        toy: 't1',
        wc: 'w1',
        floor: 'fl1',
        wallpaper: 'wp1',
      },
      wellBeing: {
        clean: new Date(),
        fun: new Date(),
        hunger: new Date(),
        thirst: new Date(),
        sleep: new Date(),
      },
    }
    ;(getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => mockPet,
    })

    const res = await getPetDataById(dummyRef)
    expect(res).toEqual(mockPet)
  })
})
