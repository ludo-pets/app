import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig'
import {
    getAllLessonsService,
    getLessonByIdService,
    markLessonAsConcluded,
} from '@/services/lessonService'

jest.mock('@/firebaseConfig', () => ({
    db: {},
}))

jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    collection: jest.fn(),
    getDocs: jest.fn(),
    updateDoc: jest.fn(),
}))

const mockGetDoc = getDoc as jest.Mock
const mockGetDocs = getDocs as jest.Mock
const mockUpdateDoc = updateDoc as jest.Mock
const mockDoc = doc as jest.Mock
const mockCollection = collection as jest.Mock

describe('LessonService', () => {
    let consoleSpy: jest.SpyInstance

    beforeEach(() => {
        jest.clearAllMocks()

        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
        consoleSpy.mockRestore()
    })

    describe('getLessonByIdService', () => {
        it('should return a lesson when found', async () => {
            const mockFirestoreData = { id: 'lesson1', title: 'Introduction' }
            mockGetDoc.mockResolvedValue({
                exists: () => true,
                data: () => mockFirestoreData,
            })
            const result = await getLessonByIdService('lesson1')
            expect(result?.lesson).toEqual(mockFirestoreData)
        })

        it('should return null if lesson is not found', async () => {
            mockGetDoc.mockResolvedValue({ exists: () => false })
            const result = await getLessonByIdService('nonexistent')
            expect(result).toBeNull()

            expect(consoleSpy).toHaveBeenCalledWith('Lição não encontrada')
        })

        it('should return null and log an error on failure', async () => {
            const error = new Error('Firestore error')
            mockGetDoc.mockRejectedValue(error)
            const result = await getLessonByIdService('lesson1')
            expect(result).toBeNull()

            expect(consoleSpy).toHaveBeenCalledWith(
                'Erro ao buscar Lição por id:',
                error
            )
        })
    })

    describe('getAllLessonsService', () => {
        it('should return all lessons sorted by order', async () => {
            const mockFirestoreData = [
                { id: 'lesson2', order: 2 },
                { id: 'lesson1', order: 1 },
            ]
            const mockDocs = mockFirestoreData.map((lesson) => ({
                data: () => lesson,
            }))
            mockGetDocs.mockResolvedValue({ docs: mockDocs })
            const result = await getAllLessonsService()
            expect(result?.lessons[0].id).toBe('lesson1')
            expect(result?.lessons[1].id).toBe('lesson2')
        })

        it('should return an empty array if no lessons are found', async () => {
            mockGetDocs.mockResolvedValue({ docs: [] })
            const result = await getAllLessonsService()
            expect(result?.lessons).toEqual([])
        })

        it('should return null and log an error on failure', async () => {
            const error = new Error('Firestore error')
            mockGetDocs.mockRejectedValue(error)
            const result = await getAllLessonsService()
            expect(result).toBeNull()

            expect(consoleSpy).toHaveBeenCalledWith(
                'Erro ao buscar Lições:',
                error
            )
        })
    })

    describe('markLessonAsConcluded', () => {
        it('should return true on successful update', async () => {
            mockUpdateDoc.mockResolvedValue(undefined)
            const result = await markLessonAsConcluded('lesson1')
            expect(result).toBe(true)
            expect(mockUpdateDoc).toHaveBeenCalledWith(undefined, {
                concluded: true,
            })
        })

        it('should return false if lessonId is not provided', async () => {
            const result = await markLessonAsConcluded('')
            expect(result).toBe(false)
        })

        it('should return false and log an error on update failure', async () => {
            const error = new Error('Update failed')
            mockUpdateDoc.mockRejectedValue(error)
            const result = await markLessonAsConcluded('lesson1')
            expect(result).toBe(false)

            expect(consoleSpy).toHaveBeenCalledWith(
                'Erro ao atualizar lição:',
                error
            )
        })
    })
})
