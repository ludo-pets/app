import { act } from '@testing-library/react-native'
import { useAllAchievementsStore } from '@/stores/allAchievementsStore'
import { fetchAchievements } from '@/services/achievementService'
import Achievement from '@/dtos/Achievement'

jest.mock('@/services/achievementService', () => ({
    __esModule: true,
    fetchAchievements: jest.fn(),
}))

const mockedFetchAchievements = fetchAchievements as jest.Mock

describe('useAllAchievementsStore', () => {
    const mockAchievements: Achievement[] = [
        { id: '1', name: 'Conquista de Teste', message: 'Teste bem-sucedido!' },
    ]

    beforeEach(() => {
        act(() => {
            useAllAchievementsStore.setState({
                achievements: null,
                loading: false,
                error: null,
            })
        })
        jest.clearAllMocks()
    })

    it('deve buscar e definir as conquistas com sucesso', async () => {
        mockedFetchAchievements.mockResolvedValue(mockAchievements)

        await act(async () => {
            await useAllAchievementsStore.getState().fetchAllAchievements()
        })

        const state = useAllAchievementsStore.getState()
        expect(state.loading).toBe(false)
        expect(state.achievements).toEqual(mockAchievements)
        expect(state.error).toBeNull()
    })

    it('deve definir um erro se o serviço retornar um valor nulo', async () => {
        mockedFetchAchievements.mockResolvedValue(null)

        await act(async () => {
            await useAllAchievementsStore.getState().fetchAllAchievements()
        })

        const state = useAllAchievementsStore.getState()
        expect(state.loading).toBe(false)
        expect(state.error).toBe('Achievements não encontrados')
        expect(state.achievements).toBeNull()
    })

    it('deve capturar e definir o erro se o serviço lançar uma exceção', async () => {
        const errorMessage = 'Falha na conexão de rede'
        mockedFetchAchievements.mockRejectedValue(new Error(errorMessage))

        await act(async () => {
            await useAllAchievementsStore.getState().fetchAllAchievements()
        })

        const state = useAllAchievementsStore.getState()
        expect(state.loading).toBe(false)
        expect(state.error).toBe(errorMessage)
        expect(state.achievements).toBeNull()
    })

    it('deve definir as conquistas manualmente com a função setAchievements', () => {
        act(() => {
            useAllAchievementsStore.getState().setAchievements(mockAchievements)
        })

        expect(useAllAchievementsStore.getState().achievements).toEqual(
            mockAchievements
        )
    })
})
