const mockDb = { type: 'mockDatabase' }

jest.doMock('firebase/firestore', () => ({
    getFirestore: jest.fn().mockReturnValue(mockDb),
    collection: jest.fn(),
    getDocs: jest.fn(),
}))

import { fetchAchievements } from '@/services/achievementService'
import {
    QuerySnapshot,
    DocumentData,
    getDocs,
    collection,
} from 'firebase/firestore'

const mockGetDocs = getDocs as jest.Mock<Promise<QuerySnapshot<DocumentData>>>
const mockCollection = collection as jest.Mock

describe('AchievementService', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('fetchAchievements', () => {
        it('should return a list of achievements on successful fetch', async () => {
            const mockAchievementsData = [
                {
                    id: 'achiev1',
                    name: 'First Step',
                    message: 'You started your journey.',
                },
                {
                    id: 'achiev2',
                    name: 'Collector',
                    message: 'You bought 10 items.',
                },
            ]

            const mockDocs = mockAchievementsData.map((achiev) => ({
                data: () => achiev,
            }))
            mockGetDocs.mockResolvedValue({
                forEach: (callback: (doc: any) => void) =>
                    mockDocs.forEach(callback),
            } as unknown as QuerySnapshot<DocumentData>)

            const achievements = await fetchAchievements()

            expect(achievements).toHaveLength(2)
            expect(achievements[0].name).toBe('First Step')
            expect(mockCollection).toHaveBeenCalledWith(mockDb, 'Achievements')
        })

        it('should return an empty array if no achievements are found', async () => {
            mockGetDocs.mockResolvedValue({
                forEach: (callback: (doc: any) => void) => {},
            } as unknown as QuerySnapshot<DocumentData>)
            const achievements = await fetchAchievements()
            expect(achievements).toEqual([])
        })

        it('should throw an error if fetching fails', async () => {
            mockGetDocs.mockRejectedValue(
                new Error('Firestore connection error')
            )
            await expect(fetchAchievements()).rejects.toThrow(
                'Failed to fetch achievements.'
            )
        })
    })
})
