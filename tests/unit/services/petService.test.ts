import { addPet, CreatePetData, getPetDataById, updatePet } from "@/services/petService"
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore"

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
        const mockedCollectionRef = 'mockedCollectionRef'
        const mockedAddDocResponse = {
            id: 'pet123',
            name: 'Bolt',
            color: 'brown',
            type: 'dog',
            activeItems: {},
            wellBeing: {},
            purchasedItems: [],
        }
        const fakeId = 'pet123'
    
        beforeEach(() => {
            jest.clearAllMocks()
        })
    
        it('should add a pet and return the created pet with ID', async () => {
            mockedCollection.mockReturnValueOnce(mockedCollectionRef)
            mockedAddDoc.mockResolvedValueOnce(mockedAddDocResponse)
    
            const result = await addPet(mockedCreatePetData)
    
            expect(collection).toHaveBeenCalledWith({ mocked: true }, 'Pet')
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
})
