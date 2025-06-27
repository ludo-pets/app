import { getUserWithPetByEmail } from '@/services/userService'
import { getDocs } from 'firebase/firestore'
import type { Pet } from '@/dtos/Pet'
import type User from '@/dtos/User'

jest.mock('../../../firebaseConfig', () => ({
    db: { type: 'mock-db' },
    auth: { type: 'mock-auth' },
}))

const dbStore: {
    Pet: { [id: string]: Pet }
    User: { [id: string]: User }
} = {
    Pet: {},
    User: {},
}

jest.mock('firebase/firestore', () => ({
    getFirestore: () => ({ type: 'mockDb' }),
    doc: (_db: any, collection: string, id: string) => ({ collection, id }),
    getDoc: jest.fn(async (docRef) => {
        const data = dbStore[docRef.collection as 'User' | 'Pet']?.[docRef.id]
        return { exists: () => !!data, data: () => data }
    }),
    collection: (_db: any, name: string) => ({ name }),
    where: (field: string, op: string, value: any) => ({ field, op, value }),
    query: (collectionRef: any, whereClause: any) => ({
        collectionRef,
        whereClause,
    }),
    getDocs: jest.fn(async (query) => {
        if (query.collectionRef.name === 'User') {
            const { whereClause } = query
            const results = Object.values(dbStore.User).filter(
                (doc) => (doc as any)[whereClause.field] === whereClause.value
            )
            return {
                empty: results.length === 0,
                docs: results.map((doc) => ({ data: () => doc, id: doc.id })),
            }
        }
        return { empty: true, docs: [] }
    }),
}))

const mockGetDocs = getDocs as jest.Mock

describe('Integration Test: User and Pet Services', () => {
    beforeEach(() => {
        dbStore.User = {}
        dbStore.Pet = {}
        jest.clearAllMocks()
    })

    it('should correctly fetch a user and their associated pet', async () => {
        const petId = 'pet001'
        const userId = 'user001'
        const userEmail = 'owner@tamagotchi.com'

        dbStore.Pet[petId] = {
            id: petId,
            name: 'Fido',
            type: 'dog',
            color: 'black',
            activeItems: {
                bed: 'b1',
                food: 'f1',
                toy: 't1',
                wc: 'w1',
                floor: 'fl1',
                wallpaper: 'wp1',
                water: 'h2o',
            },
            purchasedItems: [],
            wellBeing: {
                clean: '',
                fun: '',
                hunger: '',
                sleep: '',
                thirst: '',
            },
        }
        dbStore.User[userId] = {
            id: userId,
            email: userEmail,
            pet: petId,
            achievements: [],
            experience: 100,
            level: 5,
            money: 500,
            lastLessonConcluded: null,
            notifications: true,
        }

        const result = await getUserWithPetByEmail(userEmail)

        expect(result).not.toBeNull()
        expect(result?.user.email).toBe(userEmail)
        expect(result?.pet.name).toBe('Fido')
        expect(result?.user.pet).toBe(result?.pet.id)
    })

    it('should return null if the user is not found', async () => {
        const result = await getUserWithPetByEmail('nonexistent@email.com')

        expect(result).toBeNull()
    })

    it('should return null if the pet associated with the user is not found', async () => {
        const userId = 'user002'
        const userEmail = 'owner-no-pet@tamagotchi.com'

        dbStore.User[userId] = {
            id: userId,
            email: userEmail,
            pet: 'nonexistent-pet-id',
            achievements: [],
            experience: 100,
            level: 5,
            money: 500,
            lastLessonConcluded: null,
            notifications: true,
        }

        const result = await getUserWithPetByEmail(userEmail)

        expect(result).toBeNull()
    })
})
