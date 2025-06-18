import '@/services/petService'
import { getUserWithPetByEmail } from '@/services/userService'
import { getDocs } from 'firebase/firestore'

const dbStore: { [key: string]: { [id: string]: any } } = {
    Pet: {},
    User: {},
}

jest.mock('firebase/firestore', () => {
    const mockGetDocsFn = jest.fn(async (query) => {
        const { collectionRef, whereClause } = query
        const collectionData = dbStore[collectionRef.name] || {}
        const results = Object.values(collectionData).filter(
            (doc: any) => doc[whereClause.field] === whereClause.value
        )
        return {
            empty: results.length === 0,
            docs: results.map((doc) => ({ data: () => doc, id: doc.id })),
        }
    })

    return {
        getFirestore: () => ({ type: 'mockDb' }),
        doc: (_db: any, collection: string, id: string) => ({ collection, id }),
        getDoc: jest.fn(async (docRef) => {
            const data = dbStore[docRef.collection]?.[docRef.id]
            return { exists: () => !!data, data: () => data }
        }),
        collection: (_db: any, name: string) => ({ name }),
        where: (field: string, op: string, value: any) => ({
            field,
            op,
            value,
        }),
        query: (collectionRef: any, whereClause: any) => ({
            collectionRef,
            whereClause,
        }),
        getDocs: mockGetDocsFn,
    }
})

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
            lastLessonConcluded: '',
            notifications: true,
        }

        const result = await getUserWithPetByEmail(userEmail)

        expect(result).not.toBeNull()
        expect(result?.user.email).toBe(userEmail)
        expect(result?.pet.name).toBe('Fido')
        expect(result?.user.pet).toEqual(result?.pet.id)
    })

    it('should return null if the database call fails', async () => {
        const dbError = new Error('Firestore is offline')
        mockGetDocs.mockRejectedValueOnce(dbError)
        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        const result = await getUserWithPetByEmail('any@email.com')

        expect(result).toBeNull()
        expect(consoleSpy).toHaveBeenCalledWith(
            'Erro ao buscar User e Pet:',
            dbError
        )

        consoleSpy.mockRestore()
    })
})
