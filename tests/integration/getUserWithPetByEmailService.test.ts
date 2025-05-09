import {
  getUserWithPetByEmailService,
} from '@/services/userService'

jest.mock('firebase/firestore', () => ({
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}))

import { getDocs, getDoc } from 'firebase/firestore'

describe('getUserWithPetByEmailService (integration-simulated)', () => {
  const email = 'user@example.com'
  const userData = { id: 'u1', email, money: 0, level:0, experience:0, lastLessonConcluded:'x', notifications:true, pet: {} }
  const petData = { id: 'p1', name: 'Rex', color:'b', type:'dog', purchasedItems:[], activeItems:{bed:'',food:'',toy:'',wc:'',floor:'',wallpaper:''}, wellBeing:{clean:new Date(),fun:new Date(),hunger:new Date(),thirst:new Date(),sleep:new Date()} }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getDocs as jest.Mock).mockResolvedValue({ empty: false, docs: [{ data: () => userData }] })
    ;(getDoc as jest.Mock).mockResolvedValue({ exists: () => true, data: () => petData })
  })

  it('fetches real user & pet via the real service flow', async () => {
    const res = await getUserWithPetByEmailService(email)
    expect(res).toEqual({ user: userData, pet: petData })
  })
})
