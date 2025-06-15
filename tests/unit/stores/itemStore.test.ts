import { act } from '@testing-library/react-native'
import { getAllItemService } from '@/services/itemService'
import Item from '@/dtos/Item'
import { useItemStore } from '@/stores/itemStore'

jest.mock('@/services/itemService', () => ({
    getAllItemService: jest.fn(),
}))

const mockedGetAllItemService = getAllItemService as jest.Mock

const mockItems: Item[] = [
    {
        id: 'item1',
        name: 'Food',
        price: 10,
        requiredLevel: 1,
        category: 'food',
        image: 'food.png',
        type: 'food',
    },
    {
        id: 'item2',
        name: 'Toy',
        price: 20,
        requiredLevel: 2,
        category: 'toy',
        image: 'toy.png',
        type: 'toy',
    },
]

describe('useItemStore', () => {
    beforeEach(() => {
        act(() => {
            useItemStore.setState({
                items: [],
                loading: true,
                error: null,
            })
        })
        jest.clearAllMocks()
    })

    it('should have a correct initial state', () => {
        const { items, loading, error } = useItemStore.getState()
        expect(items).toEqual([])
        expect(loading).toBe(true)
        expect(error).toBeNull()
    })

    describe('fetchItems', () => {
        it('should fetch items and update state on success', async () => {
            mockedGetAllItemService.mockResolvedValue({ items: mockItems })

            await useItemStore.getState().fetchItems()

            const { items, loading, error } = useItemStore.getState()
            expect(loading).toBe(false)
            expect(error).toBeNull()
            expect(items).toEqual(mockItems)
            expect(mockedGetAllItemService).toHaveBeenCalledTimes(1)
        })

        it('should set an error message if service returns a falsy value', async () => {
            mockedGetAllItemService.mockResolvedValue(null)

            await useItemStore.getState().fetchItems()

            const { items, loading, error } = useItemStore.getState()
            expect(loading).toBe(false)
            expect(error).toBe('Itens não encontrados')
            expect(items).toEqual([])
        })

        it('should set a generic error message if the service throws an error without a message', async () => {
            mockedGetAllItemService.mockRejectedValue({})

            await useItemStore.getState().fetchItems()

            const { items, loading, error } = useItemStore.getState()
            expect(loading).toBe(false)
            expect(error).toBe('Erro ao buscar itens')
            expect(items).toEqual([])
        })

        it('should set the specific error message if the service throws an error with a message', async () => {
            const errorMessage = 'API limit reached'
            mockedGetAllItemService.mockRejectedValue(new Error(errorMessage))

            await useItemStore.getState().fetchItems()

            const { items, loading, error } = useItemStore.getState()
            expect(loading).toBe(false)
            expect(error).toBe(errorMessage)
            expect(items).toEqual([])
        })
    })

    describe('setItems', () => {
        it('should correctly set the items in the state', () => {
            act(() => {
                useItemStore.getState().setItems(mockItems)
            })

            const { items } = useItemStore.getState()
            expect(items).toEqual(mockItems)
        })
    })
})
