import {
    getFirestore,
    collection,
    getDocs,
    QuerySnapshot,
    DocumentData,
} from 'firebase/firestore'
import { fetchAchievements } from '@/services/achievementService'
import Achievement from '@/dtos/Achievement'

jest.mock('@/firebaseConfig', () => ({
    firebaseApp: {},
}))
jest.mock('firebase/firestore')

const mockGetDocs = getDocs as jest.Mock
const mockCollection = collection as jest.Mock
const mockGetFirestore = getFirestore as jest.Mock

describe('AchievementService', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('fetchAchievements', () => {
        it('deve retornar uma lista de conquistas em caso de sucesso', async () => {
            const mockAchievementsData: Achievement[] = [
                {
                    id: 'achiev1',
                    name: 'Iniciante',
                    message: 'Primeira lição concluída.',
                },
                {
                    id: 'achiev2',
                    name: 'Mestre',
                    message: 'Todas as lições concluídas.',
                },
            ]

            const mockDocs = mockAchievementsData.map((achiev) => ({
                data: () => achiev,
            }))
            mockGetDocs.mockResolvedValue({
                docs: mockDocs,
                forEach: (callback: (doc: any) => void) =>
                    mockDocs.forEach(callback),
            } as unknown as QuerySnapshot<DocumentData>)

            const achievements = await fetchAchievements()

            expect(achievements).toHaveLength(2)
            expect(achievements[0].name).toBe('Iniciante')
            expect(mockCollection).toHaveBeenCalledWith(
                undefined,
                'Achievements'
            )
        })

        it('deve retornar um array vazio se nenhuma conquista for encontrada', async () => {
            mockGetDocs.mockResolvedValue({
                docs: [],
                forEach: (callback: (doc: any) => void) => [].forEach(callback),
            } as unknown as QuerySnapshot<DocumentData>)

            const achievements = await fetchAchievements()
            expect(achievements).toEqual([])
        })

        it('deve lançar um erro se a busca no Firestore falhar', async () => {
            const errorMessage = 'Failed to fetch achievements.'
            mockGetDocs.mockRejectedValue(new Error(errorMessage))

            await expect(fetchAchievements()).rejects.toThrow(errorMessage)
        })
    })
})
