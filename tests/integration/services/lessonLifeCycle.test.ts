import {
    getLessonByIdService,
    markLessonAsConcluded,
} from '@/services/lessonService'

const dbStore: { [key: string]: { [id: string]: any } } = {
    Lesson: {},
}

jest.mock('firebase/firestore', () => ({
    getFirestore: () => ({ type: 'mockDb' }),
    doc: (db: any, collection: string, id: string) => ({ collection, id }),
    collection: (db: any, name: string) => ({ name }),
    updateDoc: jest.fn(async (docRef, data) => {
        Object.assign(dbStore[docRef.collection][docRef.id], data)
    }),
    getDoc: jest.fn(async (docRef) => {
        const data = dbStore[docRef.collection]?.[docRef.id]
        return {
            exists: () => !!data,
            data: () => data,
        }
    }),
}))

import { updateDoc } from 'firebase/firestore'
const mockUpdateDoc = updateDoc as jest.Mock

describe('Lesson Lifecycle Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        dbStore.Lesson = {}
    })

    it('should correctly read, update, and re-read a lesson', async () => {
        const lessonId = 'lesson-abc'
        dbStore.Lesson[lessonId] = {
            id: lessonId,
            name: 'Testable Lesson',
            order: 1,
            questions: [],
            givenExperience: 10,
            givenMoney: 10,
            icon: 'test',
            concluded: false,
        }

        const initialResult = await getLessonByIdService(lessonId)
        expect((initialResult?.lesson as any).concluded).toBe(false)

        const updateResult = await markLessonAsConcluded(lessonId)
        expect(updateResult).toBe(true)
        expect(mockUpdateDoc).toHaveBeenCalledWith(
            { collection: 'Lesson', id: lessonId },
            { concluded: true }
        )

        const finalResult = await getLessonByIdService(lessonId)
        expect((finalResult?.lesson as any).concluded).toBe(true)
    })
})
