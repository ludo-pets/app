import { getPetDataById } from '@/services/petService'
import { getDoc } from 'firebase/firestore'

jest.mock('@/firebaseConfig', () => ({ db: {} }))
jest.mock('firebase/firestore')

describe('getPetDataById', () => {
    const mockedGetDoc = getDoc as jest.Mock
    const dummyRef = {} as any
    const mockedPetData = { id: 'p1', name: 'Rex' }

    beforeEach(() => jest.clearAllMocks())

    it('should return null if pet not exists', async () => {
        mockedGetDoc.mockResolvedValueOnce({ exists: () => false })
        const result = await getPetDataById(dummyRef)

        expect(result).toBeNull()
    })

    it('should return pet data when exists', async () => {
        mockedGetDoc.mockResolvedValueOnce({
            exists: () => true,
            data: () => mockedPetData,
        })
        const result = await getPetDataById(dummyRef)
        expect(result).toEqual(mockedPetData)
    })
})
