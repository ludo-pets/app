const mockDb = { type: 'mockDatabase' }

jest.doMock('firebase/firestore', () => ({
    getFirestore: jest.fn().mockReturnValue(mockDb),
    doc: jest.fn(),
    getDoc: jest.fn(),
    collection: jest.fn(),
    getDocs: jest.fn(),
}))

import {
    fetchMinigames,
    getMinigameByIdService,
} from '@/services/minigameService'
import {
    QuerySnapshot,
    DocumentData,
    getDoc,
    getDocs,
    doc,
    collection,
} from 'firebase/firestore'

const mockGetDoc = getDoc as jest.Mock
const mockDoc = doc as jest.Mock
const mockGetDocs = getDocs as jest.Mock<Promise<QuerySnapshot<DocumentData>>>
const mockCollection = collection as jest.Mock

describe('MinigameService', () => {
    let consoleErrorSpy: jest.SpyInstance

    beforeEach(() => {
        jest.clearAllMocks()
        consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})
    })

    afterEach(() => {
        consoleErrorSpy.mockRestore()
    })

    describe('getMinigameByIdService', () => {
        it('should return a minigame when found', async () => {
            const mockFirestoreData = {
                id: 'mg1',
                name: 'Puzzle',
                givenMoney: 100,
            }
            mockGetDoc.mockResolvedValue({
                exists: () => true,
                data: () => mockFirestoreData,
            })
            const result = await getMinigameByIdService('mg1')
            expect(result).not.toBeNull()
            expect(result?.minigame.name).toBe('Puzzle')
            expect(mockDoc).toHaveBeenCalledWith(mockDb, 'Minigame', 'mg1')
        })

        it('should return null if minigame is not found', async () => {
            mockGetDoc.mockResolvedValue({ exists: () => false })
            await getMinigameByIdService('nonexistent')
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Minigame não encontrado'
            )
        })

        it('should return null on a fetch error', async () => {
            const error = new Error('Firestore connection failed')
            mockGetDoc.mockRejectedValue(error)
            await getMinigameByIdService('any-id')
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Erro ao buscar minigame:',
                error
            )
        })
    })

    describe('fetchMinigames', () => {
        it('should return a list of minigames and handle missing descriptions', async () => {
            const mockFirestoreData = [
                {
                    id: 'mg1',
                    name: 'Quiz',
                    image: 'quiz.png',
                    description: 'Test your knowledge',
                },
                { id: 'mg2', name: 'Memory', image: 'memory.png' },
            ]
            const mockDocs = mockFirestoreData.map((mg) => ({ data: () => mg }))
            mockGetDocs.mockResolvedValue({
                forEach: (callback: (doc: any) => void) =>
                    mockDocs.forEach(callback),
            } as unknown as QuerySnapshot<DocumentData>)

            const minigames = await fetchMinigames()

            expect(minigames).toHaveLength(2)
            expect(minigames[0].description).toBe('Test your knowledge')
            expect(minigames[1].description).toBe('No description')
            expect(mockCollection).toHaveBeenCalledWith(mockDb, 'Minigame')
        })

        it('should return an empty array if no minigames are found', async () => {
            mockGetDocs.mockResolvedValue({
                forEach: (callback: (doc: any) => void) => {},
            } as unknown as QuerySnapshot<DocumentData>)
            const minigames = await fetchMinigames()
            expect(minigames).toEqual([])
        })

        it('should throw an error if fetching fails', async () => {
            mockGetDocs.mockRejectedValue(
                new Error('Firestore connection error')
            )
            await expect(fetchMinigames()).rejects.toThrow(
                'Failed to fetch quiz questions.'
            )
        })
    })
})
