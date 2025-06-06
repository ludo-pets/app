import { addPet, CreatePetData } from '@/services/petService'
import { collection, addDoc } from 'firebase/firestore'

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    addDoc: jest.fn(),
}))

jest.mock('@/firebaseConfig', () => ({
    db: { mocked: true },
}))

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
