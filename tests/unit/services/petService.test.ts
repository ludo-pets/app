import {
    addPet,
    CreatePetData,
    getPetDataById,
    updatePet,
} from '@/services/petService'
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig'

jest.mock('@/firebaseConfig', () => ({ db: {} }))
jest.mock('firebase/firestore')

describe('petService', () => {
    describe('addPet (unit)', () => {
        const mockedAddDoc = addDoc as jest.Mock
        const mockedCollection = collection as jest.Mock

        const mockedCreatePetData: CreatePetData = {
            name: 'Bolt',
            color: 'brown',
            type: 'dog',
        }
        const fakeId = 'pet123'

        beforeEach(() => {
            jest.clearAllMocks()
        })

        it('should add a pet and return the created pet with ID', async () => {
            mockedCollection.mockReturnValue('mockedCollectionRef')
            mockedAddDoc.mockResolvedValue({ id: fakeId })

            const result = await addPet(mockedCreatePetData)

            expect(collection).toHaveBeenCalledWith(db, 'Pet')
            expect(addDoc).toHaveBeenCalled()
            expect(result).toMatchObject({
                id: fakeId,
                ...mockedCreatePetData,
                activeItems: expect.any(Object),
                wellBeing: expect.any(Object),
                purchasedItems: [],
            })
        })

        it('should return null and log error if Firestore throws', async () => {
            mockedCollection.mockImplementationOnce(() => {
                throw new Error('Firestore failure')
            })

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {})

            const result = await addPet(mockedCreatePetData)

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Error)
            )
            expect(result).toBeNull()

            consoleSpy.mockRestore()
        })
    })

    describe('getPetDataById', () => {
        const mockedGetDoc = getDoc as jest.Mock
        const mockedPetId = 'p1'
        const mockedPetData = { id: 'p1', name: 'Rex' }

        beforeEach(() => jest.clearAllMocks())

        it('should return null if pet does not exist', async () => {
            mockedGetDoc.mockResolvedValue({ exists: () => false })
            const result = await getPetDataById(mockedPetId)

            expect(result).toBeNull()
        })

        it('should return pet data when it exists', async () => {
            mockedGetDoc.mockResolvedValue({
                exists: () => true,
                data: () => mockedPetData,
            })
            const result = await getPetDataById(mockedPetId)
            expect(result).toEqual(mockedPetData)
        })
    })

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
            mockedUpdateDoc.mockResolvedValue(undefined)
            expect(await updatePet('p1', { name: 'Y' })).toBe(true)
        })

        it('returns false when updateDoc throws', async () => {
            mockedDoc.mockReturnValue({})
            mockedUpdateDoc.mockRejectedValue(new Error())
            expect(await updatePet('p1', { name: 'Y' })).toBe(false)
        })
    })
})
