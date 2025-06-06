import { updatePet } from '@/services/petService'
import { updateDoc, doc } from 'firebase/firestore'

jest.mock('@/firebaseConfig', () => ({ db: {} }))
jest.mock('firebase/firestore')

describe('updatePet', () => {
    const mockedDoc = doc as jest.Mock
    const mockedUpdateDoc = updateDoc as jest.Mock

    beforeEach(() => jest.clearAllMocks())

    it('returns false for empty petId', async () => {
        expect(await updatePet('', { name: 'X' })).toBe(false)
    })

    it('returns false for empty petData', async () => {
        expect(await updatePet('p1', {})).toBe(false)
    })

    it('returns true when update succeeds', async () => {
        mockedDoc.mockReturnValue({})
        mockedUpdateDoc.mockResolvedValueOnce(undefined)
        expect(await updatePet('p1', { name: 'Y' })).toBe(true)
    })

    it('returns false when updateDoc throws', async () => {
        mockedDoc.mockReturnValue({})
        mockedUpdateDoc.mockRejectedValueOnce(new Error())
        expect(await updatePet('p1', { name: 'Y' })).toBe(false)
    })
})
