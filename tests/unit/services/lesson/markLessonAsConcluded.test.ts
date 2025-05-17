import { markLessonAsConcluded } from '@/services/lessonService'
import { getDocs, updateDoc } from 'firebase/firestore'

jest.mock('@/firebaseConfig', () => ({ db: {} }))
jest.mock('firebase/firestore')

describe('markLessonAsConcluded', () => {
    const mockedUpdateDoc = updateDoc as jest.Mock

    const validlessonId = 'x2aS1AiqIJ0818MLQ05soi126'
    const emptyLessonId = ''

    beforeEach(() => jest.clearAllMocks())

    it('should return false when lesson id is empty', async () => {
        const result = await markLessonAsConcluded(emptyLessonId)
        
        expect(result).toBeFalsy()
    })

    it('should return false and error', async () => {
        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})
        ;(getDocs as jest.Mock).mockRejectedValueOnce(new Error('Erro'))

        const result = await markLessonAsConcluded(validlessonId)

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(Error)
        )
        expect(result).toBeFalsy()
    })

    it('should return true when valid lesson id and update succeed', async () => {
        ;(updateDoc as jest.Mock).mockResolvedValueOnce({
            exists: () => true,
        })
        mockedUpdateDoc.mockResolvedValueOnce(undefined)
        const result = await markLessonAsConcluded(validlessonId)
        expect(result).toBeTruthy()
    })
})
