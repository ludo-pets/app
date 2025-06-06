import { getUserWithPetByEmail } from '@/services/userService'
import { getDoc, getDocs } from 'firebase/firestore'

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
}))

jest.mock('@/firebaseConfig', () => ({
    getDb: () => ({ mocked: true }),
}))

const mockedGetDocs = getDocs as jest.Mock
const mockedGetDoc = getDoc as jest.Mock

describe('getUserWithPetByEmail (mocked Firebase)', () => {
    const mockedUserData = {
        email: 'test@example.com',
        pet: 'pet123',
        money: 50,
    }
    const mockedPetData = { name: 'Bolt', type: 'dog', color: 'brown' }

    const validExistingEmail = 'valid@email.com'
    const invalidEmail = 'invalid_email'
    const failEmail = 'fail@example.com'
    const noPetEmail = 'nopet@example.com'
    const noUserEmail = 'nouser@example.com'

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should return null if invalid email format', async () => {
        const res = await getUserWithPetByEmail(invalidEmail)
        expect(res).toBeNull()
    })

    it('should return null if user is not found', async () => {
        mockedGetDocs.mockResolvedValueOnce({ empty: true })
        const res = await getUserWithPetByEmail(noUserEmail)
        expect(res).toBeNull()
    })

    it('should return null if user has no pet field', async () => {
        mockedGetDocs.mockResolvedValueOnce({
            empty: false,
            docs: [{ data: () => ({ email: 'test@example.com' }) }],
        })
        const res = await getUserWithPetByEmail(noPetEmail)
        expect(res).toBeNull()
    })

    it('should return null if pet does not exist', async () => {
        mockedGetDocs.mockResolvedValueOnce({
            empty: false,
            docs: [
                { data: () => ({ email: 'test@example.com', pet: 'pet123' }) },
            ],
        })
        mockedGetDoc.mockResolvedValueOnce({ exists: () => false })

        const res = await getUserWithPetByEmail(noPetEmail)
        expect(res).toBeNull()
    })

    it('should return null and log error if Firestore throws', async () => {
        mockedGetDocs.mockRejectedValueOnce(new Error('Firestore failure'))

        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})
        const result = await getUserWithPetByEmail(failEmail)

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(Error)
        )
        expect(result).toBeNull()

        consoleSpy.mockRestore()
    })

    it('should return user and pet when both exist', async () => {
        mockedGetDocs.mockResolvedValueOnce({
            empty: false,
            docs: [{ data: () => mockedUserData }],
        })
        mockedGetDoc.mockResolvedValueOnce({
            exists: () => true,
            data: () => mockedPetData,
        })

        const res = await getUserWithPetByEmail(validExistingEmail)
        expect(res?.user.email).toBe(mockedUserData.email)
        expect(res?.user.pet).toBe(mockedUserData.pet)
        expect(res?.pet.name).toBe(mockedPetData.name)
        expect(res?.pet.type).toBe(mockedPetData.type)
    })
})
