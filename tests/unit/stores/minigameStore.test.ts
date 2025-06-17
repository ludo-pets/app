import { act } from '@testing-library/react-native'
import { getMinigameByIdService } from '@/services/minigameService'
import Minigame from '@/dtos/Minigame'
import { useMinigameStore } from '@/stores/minigameStore'

jest.mock('@/services/minigameService', () => ({
    getMinigameByIdService: jest.fn(),
}))

const mockedGetMinigameByIdService = getMinigameByIdService as jest.Mock

const mockMinigame: Minigame = {
    id: 'mg1',
    name: 'Memory Game',
    description: 'A cool memory game.',
    image: 'https://example.com/image.png',
    givenMoney: 100,
}

describe('useMinigameStore', () => {
    beforeEach(() => {
        act(() => {
            useMinigameStore.setState({
                minigame: null,
                loading: false,
                error: null,
            })
        })
        jest.clearAllMocks()
    })

    it('should have a correct initial state', () => {
        const { minigame, loading, error } = useMinigameStore.getState()
        expect(minigame).toBeNull()
        expect(loading).toBe(false)
        expect(error).toBeNull()
    })

    describe('fetchMinigame', () => {
        const minigameId = 'mg1'

        it('should fetch minigame and update state on success', async () => {
            mockedGetMinigameByIdService.mockResolvedValue({
                minigame: mockMinigame,
            })

            await useMinigameStore.getState().fetchMinigame(minigameId)

            const { minigame, loading, error } = useMinigameStore.getState()
            expect(loading).toBe(false)
            expect(error).toBeNull()
            expect(minigame).toEqual(mockMinigame)
            expect(mockedGetMinigameByIdService).toHaveBeenCalledWith(
                minigameId
            )
        })

        it('should set an error message if service returns a falsy value', async () => {
            mockedGetMinigameByIdService.mockResolvedValue(null)

            await useMinigameStore.getState().fetchMinigame(minigameId)

            const { minigame, loading, error } = useMinigameStore.getState()
            expect(loading).toBe(false)
            expect(error).toBe('Minigame não encontrado')
            expect(minigame).toBeNull()
        })

        it('should set an error message if the service throws an error', async () => {
            const errorMessage = 'Server down'
            mockedGetMinigameByIdService.mockRejectedValue(
                new Error(errorMessage)
            )

            await useMinigameStore.getState().fetchMinigame(minigameId)

            const { minigame, loading, error } = useMinigameStore.getState()
            expect(loading).toBe(false)
            expect(error).toBe(errorMessage)
            expect(minigame).toBeNull()
        })
    })

    describe('setMinigame', () => {
        it('should correctly set the minigame in the state', () => {
            act(() => {
                useMinigameStore.getState().setMinigame(mockMinigame)
            })

            const { minigame } = useMinigameStore.getState()
            expect(minigame).toEqual(mockMinigame)
        })
    })
})
