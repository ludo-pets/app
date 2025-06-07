import { getUserDataByEmail, updateUser } from '@/services/userService'
import { doc, getDocs, updateDoc } from 'firebase/firestore'

jest.mock('@/firebaseConfig', () => ({ db: {} }))
jest.mock('firebase/firestore')

const mockedGetDocs = getDocs as jest.Mock
const mockedDoc = doc as jest.Mock
const mockedUpdateDoc = updateDoc as jest.Mock

describe('userService', () => {
    describe('getUserDataByEmail', () => {
        const mockedUserData = { id: 'u1', email: 'valid@email.com', pet: 'p1' }
        const validExistingEmail = 'valid@email.com'
        const validNonExistingEmail = 'valid_non_existing@email.com'
        const invalidEmail = 'invalid_email'
    
        beforeEach(() => jest.clearAllMocks())
    
        it('should reject invalid email format', async () => {
            const res = await getUserDataByEmail(invalidEmail)
            expect(res).toBeNull()
        })
    
        it('should return null when no user exists', async () => {
            mockedGetDocs.mockResolvedValueOnce({ empty: true })
            const res = await getUserDataByEmail(validNonExistingEmail)
            expect(res).toBeNull()
        })
    
        it('should return user data when found', async () => {
            mockedGetDocs.mockResolvedValueOnce({
                empty: false,
                docs: [{ data: () => mockedUserData }],
            })
            const res = await getUserDataByEmail(validExistingEmail)
            expect(res).toEqual(mockedUserData)
        })
    })
    
    
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
})
