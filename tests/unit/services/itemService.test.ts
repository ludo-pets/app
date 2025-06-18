import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebaseConfig'
import Item from '@/dtos/Item'
import { getAllItems } from '@/services/itemService'

jest.mock('@/firebaseConfig', () => ({
    db: {},
}))

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    getDocs: jest.fn(),
}))

const mockGetDocs = getDocs as jest.Mock
const mockCollection = collection as jest.Mock

describe('ItemService', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('getAllItems', () => {
        it('should return an object with items on a successful fetch', async () => {
            const mockItems: Partial<Item>[] = [
                { id: 'item1', name: 'Magic Sword', price: 150 },
                { id: 'item2', name: 'Health Potion', price: 50 },
            ]

            const mockDocs = mockItems.map((item) => ({
                id: item.id,
                data: () => ({ ...item }),
            }))

            mockGetDocs.mockResolvedValue({ docs: mockDocs })

            const result = await getAllItems()

            expect(result).not.toBeNull()
            expect(result?.items).toHaveLength(2)
            expect(result?.items[0].name).toBe('Magic Sword')
            expect(mockCollection).toHaveBeenCalledWith(db, 'Item')
            expect(mockGetDocs).toHaveBeenCalled()
        })

        it('should return an object with an empty items array if no items are found', async () => {
            mockGetDocs.mockResolvedValue({ docs: [] })

            const result = await getAllItems()

            expect(result).not.toBeNull()
            expect(result?.items).toEqual([])
        })

        it('should return null and log an error if fetching fails', async () => {
            const error = new Error('Firestore fetch failed')
            mockGetDocs.mockRejectedValue(error)
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {})

            const result = await getAllItems()

            expect(result).toBeNull()
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Erro ao buscar itens:',
                error
            )

            consoleErrorSpy.mockRestore()
        })
    })
})
