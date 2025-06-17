import { getAllLessonsService } from '@/services/lessonService'
import { getDocs } from 'firebase/firestore'

jest.mock('firebase/firestore', () => {
    const actual = jest.requireActual('firebase/firestore')
    return {
        ...actual,
        getDocs: jest.fn(),
    }
})

describe('getAllLessonsService', () => {
    const lessons = [
        { id: '123', title: 'Lição 1' },
        { id: '234', title: 'Lição 2' },
        { id: '345', title: 'Lição 3' },
    ]

    it('should return all lessons', async () => {
        ;(getDocs as jest.Mock).mockResolvedValueOnce({
            docs: lessons.map((lesson) => ({
                id: lesson.id,
                data: () => lesson,
            })),
        })

        const result = await getAllLessonsService()
        expect(result).toEqual({
            lessons: [...lessons],
        })
    })

    it('should return null if error occurs', async () => {
        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})
        ;(getDocs as jest.Mock).mockRejectedValueOnce(new Error('Erro'))

        const result = await getAllLessonsService()

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(Error)
        )
        expect(result).toBeNull()

        consoleSpy.mockRestore()
    })
})
