import { getAllItems } from '@/services/itemService'
import { collection, getDocs } from 'firebase/firestore'

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    getDocs: jest.fn(),
}))

describe('getAllItems', () => {
    const mockItems = [
        {
            id: 'it1',
            data: () => ({
                name: 'Item 1',
                price: 25,
                requiredLevel: 1,
                category: 'category1',
                image: 'image1',
                type: 'type1',
            }),
        },
        {
            id: 'it2',
            data: () => ({
                name: 'Item 2',
                price: 50,
                requiredLevel: 0,
                category: 'category2',
                image: 'image2',
                type: 'type2',
            }),
        },
    ]

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should return a list of items', async () => {
        ;(getDocs as jest.Mock).mockResolvedValueOnce({ docs: mockItems })

        const result = await getAllItems()

        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Item')
        expect(getDocs).toHaveBeenCalled()
        expect(result).toEqual({
            items: mockItems.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })),
        })
    })

    it('should return null and log error if getDocs throws', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
        const error = new Error('Falha ao buscar')
        ;(getDocs as jest.Mock).mockRejectedValueOnce(error)

        const result = await getAllItems()

        expect(result).toBeNull()
        expect(consoleSpy).toHaveBeenCalledWith('Erro ao buscar itens:', error)
        consoleSpy.mockRestore()
    })

    it('should handle empty collection gracefully', async () => {
        ;(getDocs as jest.Mock).mockResolvedValueOnce({ docs: [] })

        const result = await getAllItems()
        expect(result).toEqual({ items: [] })
    })

    it('should handle missing fields in documents', async () => {
        const incompleteDocs = [
            {
                id: 'item3',
                data: () => ({ name: 'Item Incompleto' }),
            },
        ]

        ;(getDocs as jest.Mock).mockResolvedValueOnce({ docs: incompleteDocs })

        const result = await getAllItems()
        expect(result).toEqual({
            items: [
                {
                    id: 'item3',
                    name: 'Item Incompleto',
                    price: undefined,
                    requiredLevel: undefined,
                    category: undefined,
                    image: undefined,
                    type: undefined,
                },
            ],
        })
    })
})
