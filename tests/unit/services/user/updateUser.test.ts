import { updateUser } from '@/services/userService'
import { updateDoc, doc } from 'firebase/firestore'

jest.mock('@/firebaseConfig', () => ({ db: {} }))
jest.mock('firebase/firestore')

const mockedUpdateDoc = updateDoc as jest.Mock
const mockedDoc = doc as jest.Mock

describe('updateUser', () => {
    beforeEach(() => jest.clearAllMocks())

    it('returns false for empty userId', async () => {
        expect(await updateUser('', { money: 350 })).toBe(false)
    })

    it('returns false for empty userData', async () => {
        expect(await updateUser('u1', {})).toBe(false)
    })

    it('returns true when update succeeds', async () => {
        mockedDoc.mockReturnValue({})
        mockedUpdateDoc.mockResolvedValueOnce(undefined)
        expect(await updateUser('u1', { email: 'a@b.com' })).toBe(true)
    })

    it('returns false when updateDoc throws', async () => {
        mockedDoc.mockReturnValue({})
        mockedUpdateDoc.mockRejectedValueOnce(new Error())
        expect(await updateUser('u1', { email: 'a@b.com' })).toBe(false)
    })
})
