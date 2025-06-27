import {
    getUserWithPetByEmail,
    getUserDataByEmail,
    updateUser,
    createUser,
} from '@/services/userService'
import { getPetDataById } from '@/services/petService'
import {
    doc,
    getDocs,
    updateDoc,
    query,
    where,
    collection,
    setDoc,
} from 'firebase/firestore'
import { showToast } from '@/utils/Toast'
import User from '@/dtos/User'
import { Pet } from '@/dtos/Pet'

jest.mock('@/firebaseConfig', () => ({ db: {} }))
jest.mock('firebase/firestore')
jest.mock('@/services/petService')
jest.mock('@/utils/Toast')

const mockedGetDocs = getDocs as jest.Mock
const mockedSetDoc = setDoc as jest.Mock
const mockedUpdateDoc = updateDoc as jest.Mock
const mockedGetPetDataById = getPetDataById as jest.Mock
const mockedQuery = query as jest.Mock
const mockedCollection = collection as jest.Mock
const mockedWhere = where as jest.Mock
const mockedDoc = doc as jest.Mock

describe('userService', () => {
    let consoleSpy: jest.SpyInstance

    beforeEach(() => {
        jest.clearAllMocks()
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
        consoleSpy.mockRestore()
    })

    describe('getUserWithPetByEmail', () => {
        const email = 'dono@pet.com'
        const mockUser: Partial<User> = { email, pet: 'pet1' }
        const mockPet: Partial<Pet> = { id: 'pet1', name: 'Rex' }

        it('deve retornar o usuário e o pet em caso de sucesso', async () => {
            mockedGetDocs.mockResolvedValue({
                docs: [{ data: () => mockUser }],
            })
            mockedGetPetDataById.mockResolvedValue(mockPet)

            const result = await getUserWithPetByEmail(email)

            expect(result).not.toBeNull()
            expect(result?.user).toEqual(mockUser)
            expect(result?.pet).toEqual(mockPet)
        })

        it('deve retornar nulo se o usuário não for encontrado', async () => {
            mockedGetDocs.mockResolvedValue({ empty: true })
            const result = await getUserWithPetByEmail(email)
            expect(result).toBeNull()
        })

        it('deve retornar nulo se o usuário não tiver um pet associado', async () => {
            mockedGetDocs.mockResolvedValue({
                docs: [{ data: () => ({ ...mockUser, pet: null }) }],
            })
            const result = await getUserWithPetByEmail(email)
            expect(result).toBeNull()
        })

        it('deve retornar nulo se o pet associado não for encontrado', async () => {
            mockedGetDocs.mockResolvedValue({
                docs: [{ data: () => mockUser }],
            })
            mockedGetPetDataById.mockResolvedValue(null)
            const result = await getUserWithPetByEmail(email)
            expect(result).toBeNull()
        })

        it('deve retornar nulo e registrar um erro se a busca falhar', async () => {
            const error = new Error('Falha na rede')
            mockedGetDocs.mockRejectedValue(error)
            const result = await getUserWithPetByEmail(email)
            expect(result).toBeNull()
            expect(consoleSpy).toHaveBeenCalledWith(
                'Erro ao buscar User e Pet:',
                error
            )
        })
    })

    describe('getUserDataByEmail', () => {
        it('deve retornar os dados do usuário se o e-mail for válido e o usuário existir', async () => {
            const mockUserData = { id: 'user1', email: 'user@example.com' }
            mockedGetDocs.mockResolvedValue({
                docs: [{ data: () => mockUserData }],
                empty: false,
            })

            const result = await getUserDataByEmail('user@example.com')
            expect(result).toEqual(mockUserData)
        })

        it('deve retornar nulo para um formato de e-mail inválido', async () => {
            const result = await getUserDataByEmail('emailinvalido')
            expect(result).toBeNull()
            expect(consoleSpy).toHaveBeenCalledWith(
                'Formato do e-mail inválido'
            )
        })

        it('deve retornar nulo se o usuário não for encontrado no banco de dados', async () => {
            mockedGetDocs.mockResolvedValue({ empty: true })
            const result = await getUserDataByEmail('naoexiste@example.com')
            expect(result).toBeNull()
            expect(consoleSpy).toHaveBeenCalledWith('User não encontrado')
        })
    })

    describe('createUser', () => {
        it('deve criar um novo usuário e retorná-lo', async () => {
            const params = {
                id: 'user123',
                email: 'new@user.com',
                newPetId: 'pet456',
            }
            mockedSetDoc.mockResolvedValue(undefined)
            const result = await createUser(params)
            expect(result?.email).toBe(params.email)
            expect(mockedSetDoc).toHaveBeenCalled()
        })

        it('deve retornar nulo se a escrita no Firestore falhar', async () => {
            const error = new Error('Falha de escrita')
            mockedSetDoc.mockRejectedValue(error)
            const params = {
                id: 'user123',
                email: 'new@user.com',
                newPetId: 'pet456',
            }
            const result = await createUser(params)
            expect(result).toBeNull()
            expect(consoleSpy).toHaveBeenCalledWith(
                'createUser: Firestore write failed ->',
                error
            )
        })
    })

    describe('updateUser', () => {
        it('deve retornar verdadeiro em caso de sucesso na atualização', async () => {
            mockedUpdateDoc.mockResolvedValue(undefined)
            const result = await updateUser('user1', { money: 500 })
            expect(result).toBe(true)
            expect(mockedUpdateDoc).toHaveBeenCalled()
        })

        it('deve retornar falso se userId for nulo ou vazio', async () => {
            const result = await updateUser('', { money: 100 })
            expect(result).toBe(false)
            expect(mockedUpdateDoc).not.toHaveBeenCalled()
        })

        it('deve retornar falso se userData for um objeto vazio', async () => {
            const result = await updateUser('user1', {})
            expect(result).toBe(false)
            expect(mockedUpdateDoc).not.toHaveBeenCalled()
        })

        it('deve retornar falso e chamar showToast após um erro de atualização', async () => {
            jest.useFakeTimers()
            const error = new Error('Falha na atualização')
            mockedUpdateDoc.mockRejectedValue(error)
            const result = await updateUser('u1', { money: 100 })

            expect(result).toBe(false)
            expect(consoleSpy).toHaveBeenCalledWith(
                'Erro ao atualizar User:',
                error
            )

            jest.runAllTimers()

            expect(showToast).toHaveBeenCalledWith(
                'Erro ao atualizar usuário',
                'error'
            )
            jest.useRealTimers()
        })
    })
})
