import {
    getLessonByIdService,
} from '@/services/lessonService'
import { getDoc } from 'firebase/firestore'

jest.mock('firebase/firestore', () => {
    const actual = jest.requireActual('firebase/firestore')
    return {
        ...actual,
        getDoc: jest.fn(),
    }
})

describe('getLessonByIdService', () => {
    const lessons = [
        { id: '123', title: 'Lição 1' },
        { id: '234', title: 'Lição 2' },
        { id: '345', title: 'Lição 3' },
    ]

    it('should return lesson if exists', async () => {
        ;(getDoc as jest.Mock).mockResolvedValueOnce({
            exists: () => true,
            data: () => lessons[0],
        })

        const result = await getLessonByIdService(lessons[0].id)
        expect(result).toEqual({ lesson: lessons[0] })
    })

    it('should return null if lesson does not exist', async () => {
        ;(getDoc as jest.Mock).mockResolvedValueOnce({
            exists: () => false,
        })

        const result = await getLessonByIdService(lessons[1].id)
        expect(result).toBeNull()
    })

    it('should return null if error occurs', async () => {
        ;(getDoc as jest.Mock).mockRejectedValueOnce(new Error('Erro'))

        const result = await getLessonByIdService(lessons[2].id)
        expect(result).toBeNull()
    })
})
