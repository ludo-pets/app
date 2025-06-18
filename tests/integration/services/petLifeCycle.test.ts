import { addPet, updatePet, CreatePetData } from '@/services/petService'
import { Pet } from '@/dtos/Pet'

const dbStore: { [key: string]: { [id: string]: any } } = {
    Pet: {},
}

jest.mock('firebase/firestore', () => ({
    getFirestore: () => ({ type: 'mockDb' }),
    doc: (_db: any, collection: string, id: string) => ({ collection, id }),
    collection: (_db: any, name: string) => ({ name }),
    addDoc: jest.fn(async (collectionRef, data) => {
        const id = `pet_${Math.random()}`
        dbStore[collectionRef.name][id] = data
        return { id }
    }),
    updateDoc: jest.fn(async (docRef, data) => {
        if (dbStore[docRef.collection]?.[docRef.id]) {
            Object.assign(dbStore[docRef.collection][docRef.id], data)
        }
    }),
}))

import { updateDoc } from 'firebase/firestore'
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
        expect(dbStore.Pet[petId].name).toBe('Buddy')

        const updatedData: Partial<Pet> = { name: 'Super Buddy' }
        const updateSuccess = await updatePet(petId, updatedData)

        expect(updateSuccess).toBe(true)
        expect(dbStore.Pet[petId].name).toBe('Super Buddy')
        expect(mockUpdateDoc).toHaveBeenCalledWith(
            { collection: 'Pet', id: petId },
            updatedData
        )
    })
})
