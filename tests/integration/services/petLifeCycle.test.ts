import { addPet, updatePet, CreatePetData } from '@/services/petService'
import { Pet } from '@/dtos/Pet'
import { updateDoc } from 'firebase/firestore'

jest.mock('../../../firebaseConfig', () => ({
    db: { type: 'mock-db' },
    auth: { type: 'mock-auth' },
}))

const dbStore: { [key: string]: { [id: string]: any } } = {
    Pet: {},
}

jest.mock('firebase/firestore', () => ({
    getFirestore: () => ({ type: 'mockDb' }),
    doc: (_db: any, collection: string, id: string) => ({
        _path: `${collection}/${id}`,
        collection,
        id,
    }),
    collection: (_db: any, name: string) => ({ name }),
    addDoc: jest.fn(async (collectionRef, data) => {
        const id = 'new-pet-id-123'
        dbStore[collectionRef.name][id] = { ...data, id }
        return { id }
    }),
    updateDoc: jest.fn(async (docRef, data) => {
        if (dbStore[docRef.collection]?.[docRef.id]) {
            Object.assign(dbStore[docRef.collection][docRef.id], data)
        }
    }),
}))

const mockUpdateDoc = updateDoc as jest.Mock

describe('Integration Test: Pet Service Lifecycle', () => {
    beforeEach(() => {
        dbStore.Pet = {}
        jest.clearAllMocks()
    })

    it('should create a new pet and then update its name', async () => {
        const petToCreate: CreatePetData = {
            name: 'Buddy',
            color: 'golden',
            type: 'dog',
        }

        const createdPet = await addPet(petToCreate)

        expect(createdPet).not.toBeNull()
        expect(createdPet?.name).toBe('Buddy')

        const petId = createdPet!.id

        expect(dbStore.Pet[petId]).toBeDefined()
        expect(dbStore.Pet[petId].name).toBe('Buddy')

        const updatedData: Partial<Pet> = { name: 'Super Buddy' }

        const updateSuccess = await updatePet(petId, updatedData)

        expect(updateSuccess).toBe(true)
        expect(dbStore.Pet[petId].name).toBe('Super Buddy')
        expect(mockUpdateDoc).toHaveBeenCalledTimes(1)
        expect(mockUpdateDoc).toHaveBeenCalledWith(
            expect.objectContaining({ _path: `Pet/${petId}` }),
            updatedData
        )
    })
})
