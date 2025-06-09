import {
    getUserWithPetByEmail,
    getUserDataByEmail,
    updateUser,
} from '@/services/userService'
import { getPetDataById } from '@/services/petService'
import {
    doc,
    getDocs,
    updateDoc,
    query,
    where,
    collection,
} from 'firebase/firestore'
import User from '@/dtos/User'
import { Pet } from '@/dtos/Pet'

jest.mock('@/firebaseConfig', () => ({ db: {} }))
jest.mock('firebase/firestore')
jest.mock('@/services/petService')

const mockedGetDocs = getDocs as jest.Mock
const mockedDoc = doc as jest.Mock
const mockedUpdateDoc = updateDoc as jest.Mock
const mockedGetPetDataById = getPetDataById as jest.Mock
const mockedQuery = query as jest.Mock
const mockedWhere = where as jest.Mock
const mockedCollection = collection as jest.Mock

describe('userService', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('getUserWithPetByEmail', () => {
        const email = 'test@example.com'
        const mockUserWithPet: Partial<User> = {
            email,
            pet: 'pet1',
        }
        const mockUserWithoutPet: Partial<User> = {
            email,
            pet: undefined,
        }
        const mockPet: Partial<Pet> = { id: 'pet1', name: 'Rex' }

        it('should return user and pet data on success', async () => {
            mockedGetDocs.mockResolvedValue({
                docs: [{ data: () => mockUserWithPet }],
            })
            mockedGetPetDataById.mockResolvedValue(mockPet)
            const result = await getUserWithPetByEmail(email)
            expect(result?.user).toEqual(mockUserWithPet)
            expect(result?.pet).toEqual(mockPet)
        })

        it('should return null if userData is not found', async () => {
            mockedGetDocs.mockResolvedValue({ empty: true })
            const result = await getUserWithPetByEmail(email)
            expect(result).toBeNull()
        })

        it('should return null if user has no pet reference', async () => {
            mockedGetDocs.mockResolvedValue({
                docs: [{ data: () => mockUserWithoutPet }],
            })
            const result = await getUserWithPetByEmail(email)
            expect(result).toBeNull()
            expect(mockedGetPetDataById).not.toHaveBeenCalled()
        })

        it('should return null if petData is not found', async () => {
            mockedGetDocs.mockResolvedValue({
                docs: [{ data: () => mockUserWithPet }],
            })
            mockedGetPetDataById.mockResolvedValue(null)
            const result = await getUserWithPetByEmail(email)
            expect(result).toBeNull()
        })

        it('should return null and log error if a dependency throws an error', async () => {
            const dbError = new Error('Database connection failed')
            mockedGetDocs.mockRejectedValue(dbError)
            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {})
            const result = await getUserWithPetByEmail(email)
            expect(result).toBeNull()
            expect(consoleSpy).toHaveBeenCalledWith(
                'Erro ao buscar User e Pet:',
                dbError
            )
            consoleSpy.mockRestore()
        })
    })

    describe('getUserDataByEmail', () => {
        const validExistingEmail = 'valid@email.com'
        const invalidEmail = 'invalid_email'

        it('should reject invalid email format', async () => {
            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {})
            const res = await getUserDataByEmail(invalidEmail)
            expect(res).toBeNull()
            expect(consoleSpy).toHaveBeenCalledWith(
                'Formato do e-mail inválido'
            )
            consoleSpy.mockRestore()
        })

        it('should return null when no user exists', async () => {
            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {})
            mockedGetDocs.mockResolvedValueOnce({ empty: true })
            const res = await getUserDataByEmail('valid_non_existing@email.com')
            expect(res).toBeNull()
            expect(consoleSpy).toHaveBeenCalledWith('User não encontrado')
            consoleSpy.mockRestore()
        })

        it('should return user data when found', async () => {
            const mockedUserData = { id: 'u1', email: validExistingEmail }
            mockedGetDocs.mockResolvedValueOnce({
                docs: [{ data: () => mockedUserData }],
            })
            const res = await getUserDataByEmail(validExistingEmail)
            expect(res).toEqual(mockedUserData)
        })
    })

    describe('updateUser', () => {
        it('returns false for empty userId', async () => {
            expect(await updateUser('', { money: 350 })).toBe(false)
        })

        it('returns false for empty userData', async () => {
            expect(await updateUser('u1', {})).toBe(false)
        })

        it('returns true when update succeeds', async () => {
            mockedUpdateDoc.mockResolvedValueOnce(undefined)
            expect(await updateUser('u1', { email: 'a@b.com' })).toBe(true)
        })

        it('returns false when updateDoc throws', async () => {
            mockedUpdateDoc.mockRejectedValueOnce(new Error())
            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {})
            expect(await updateUser('u1', { email: 'a@b.com' })).toBe(false)
            expect(consoleSpy).toHaveBeenCalledWith(
                'Erro ao atualizar User:',
                expect.any(Error)
            )
            consoleSpy.mockRestore()
        })
    })
})
