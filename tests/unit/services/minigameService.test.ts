import {
    getDoc,
    doc,
    getFirestore,
    collection,
    getDocs,
    QuerySnapshot,
    DocumentData,
} from 'firebase/firestore'
import {
    getMinigameByIdService,
    fetchMinigames,
} from '@/services/minigameService'

jest.mock('@/firebaseConfig', () => ({
    firebaseApp: {},
}))
jest.mock('firebase/firestore')

const mockGetDoc = getDoc as jest.Mock
const mockDoc = doc as jest.Mock
const mockGetDocs = getDocs as jest.Mock
const mockCollection = collection as jest.Mock
const mockGetFirestore = getFirestore as jest.Mock

describe('MinigameService', () => {
    let consoleSpy: jest.SpyInstance

    beforeEach(() => {
        jest.clearAllMocks()
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
        consoleSpy.mockRestore()
    })

    describe('getMinigameByIdService', () => {
        it('deve retornar um minigame quando encontrado', async () => {
            const mockData = { id: 'mg1', name: 'Quiz', givenMoney: 100 }
            mockGetDoc.mockResolvedValue({
                exists: () => true,
                data: () => mockData,
            })

            const result = await getMinigameByIdService('mg1')

            expect(result?.minigame.name).toBe('Quiz')
            expect(result?.minigame.image).toBe('')
        })

        it('deve retornar nulo se o minigame não for encontrado', async () => {
            mockGetDoc.mockResolvedValue({ exists: () => false })
            const result = await getMinigameByIdService('not-found')
            expect(result).toBeNull()
            expect(consoleSpy).toHaveBeenCalledWith('Minigame não encontrado')
        })

        it('deve retornar nulo e registrar erro na falha', async () => {
            const error = new Error('Falha de conexão')
            mockGetDoc.mockRejectedValue(error)
            const result = await getMinigameByIdService('any-id')
            expect(result).toBeNull()
            expect(consoleSpy).toHaveBeenCalledWith(
                'Erro ao buscar minigame:',
                error
            )
        })
    })

    describe('fetchMinigames', () => {
        it('deve retornar uma lista de minigames', async () => {
            const mockData = [{ id: 'mg1', name: 'Quiz' }]
            const mockDocs = mockData.map((d) => ({ data: () => d }))
            mockGetDocs.mockResolvedValue({
                docs: mockDocs,
                forEach: (cb: (d: any) => void) => mockDocs.forEach(cb),
            } as any)

            const result = await fetchMinigames()
            expect(result).toHaveLength(1)
            expect(result[0].name).toBe('Quiz')
        })

        it('deve lançar um erro se a busca falhar', async () => {
            const error = new Error('Failed to fetch quiz questions.')
            mockGetDocs.mockRejectedValue(error)
            await expect(fetchMinigames()).rejects.toThrow(error)
        })
    })
})
