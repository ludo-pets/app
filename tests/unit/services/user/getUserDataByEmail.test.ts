import { getUserDataByEmail } from '@/services/userService'
import { getDocs } from 'firebase/firestore'

jest.mock('@/firebaseConfig', () => ({ db: {} }))
jest.mock('firebase/firestore')

const mockedGetDocs = getDocs as jest.Mock

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
