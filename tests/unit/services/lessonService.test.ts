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
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('getLessonByIdService', () => {
        it('should return a lesson when found', async () => {
            const mockFirestoreData = {
                id: 'lesson1',
                title: 'Introduction',
                order: 1,
                concluded: false,
            }
            mockGetDoc.mockResolvedValue({
                exists: () => true,
                data: () => mockFirestoreData,
            })

            const result = await getLessonByIdService('lesson1')

            expect(result).not.toBeNull()
            expect(result?.lesson).toEqual(mockFirestoreData)
            expect(mockDoc).toHaveBeenCalledWith(db, 'Lesson', 'lesson1')
        })

        it('should return null if lesson is not found', async () => {
            mockGetDoc.mockResolvedValue({ exists: () => false })
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {})

            const result = await getLessonByIdService('nonexistent')

            expect(result).toBeNull()
            expect(consoleErrorSpy).toHaveBeenCalledWith('Lição não encontrada')

            consoleErrorSpy.mockRestore()
        })

        it('should return null and log an error on failure', async () => {
            const error = new Error('Firestore error')
            mockGetDoc.mockRejectedValue(error)
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {})

            const result = await getLessonByIdService('lesson1')

            expect(result).toBeNull()
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Erro ao buscar Lição por id:',
                error
            )

            consoleErrorSpy.mockRestore()
        })
    })

    describe('getAllLessonsService', () => {
        it('should return all lessons sorted by order', async () => {
            const mockFirestoreData = [
                {
                    id: 'lesson2',
                    title: 'Advanced',
                    order: 2,
                    concluded: false,
                },
                {
                    id: 'lesson1',
                    title: 'Introduction',
                    order: 1,
                    concluded: true,
                },
            ]
            const mockDocs = mockFirestoreData.map((lesson) => ({
                data: () => lesson,
            }))
            mockGetDocs.mockResolvedValue({ docs: mockDocs })

            const result = await getAllLessonsService()

            expect(result).not.toBeNull()
            expect(result?.lessons).toHaveLength(2)
            expect(result?.lessons[0].id).toBe('lesson1')
            expect(result?.lessons[1].id).toBe('lesson2')
            expect(mockCollection).toHaveBeenCalledWith(db, 'Lesson')
        })

        it('should return an empty array if no lessons are found', async () => {
            mockGetDocs.mockResolvedValue({ docs: [] })

            const result = await getAllLessonsService()

            expect(result).not.toBeNull()
            expect(result?.lessons).toEqual([])
        })

        it('should return null and log an error on failure', async () => {
            const error = new Error('Firestore error')
            mockGetDocs.mockRejectedValue(error)
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {})

            const result = await getAllLessonsService()

            expect(result).toBeNull()
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Erro ao buscar Lições:',
                error
            )

            consoleErrorSpy.mockRestore()
        })
    })

    describe('markLessonAsConcluded', () => {
        it('should return true on successful update', async () => {
            mockUpdateDoc.mockResolvedValue(undefined)

            const result = await markLessonAsConcluded('lesson1')

            expect(result).toBe(true)
            expect(mockDoc).toHaveBeenCalledWith(db, 'Lesson', 'lesson1')
            expect(mockUpdateDoc).toHaveBeenCalledWith(
                mockDoc.mock.results[0].value,
                { concluded: true }
            )
        })

        it('should return false if lessonId is not provided', async () => {
            const result = await markLessonAsConcluded('')

            expect(result).toBe(false)
            expect(mockUpdateDoc).not.toHaveBeenCalled()
        })

        it('should return false and log an error on update failure', async () => {
            const error = new Error('Update failed')
            mockUpdateDoc.mockRejectedValue(error)
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {})

            const result = await markLessonAsConcluded('lesson1')

            expect(result).toBe(false)
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Erro ao atualizar lição:',
                error
            )

            consoleErrorSpy.mockRestore()
        })
    })
})
