import type Lesson from '@/dtos/Lesson'
import { markLessonAsConcluded } from '@/services/lessonService'

import { updateDoc } from 'firebase/firestore'

jest.mock('../../../firebaseConfig', () => ({
    db: { type: 'mock-db' },
    auth: { type: 'mock-auth' },
}))

const dbStore: {
    Lesson: { [id: string]: any }
} = {
    Lesson: {},
}

jest.mock('firebase/firestore', () => ({
    doc: (db: any, collection: string, id: string) => ({
        _path: `${collection}/${id}`,
        collection,
        id,
    }),
    updateDoc: jest.fn(async (docRef, data) => {
        const [collection, id] = docRef._path.split('/')
        const collectionKey = collection as keyof typeof dbStore
        if (dbStore[collectionKey]?.[id]) {
            Object.assign(dbStore[collectionKey][id], data)
        }
    }),
}))

describe('Lesson Service', () => {
    const mockUpdateDoc = updateDoc as jest.Mock

    beforeEach(() => {
        jest.clearAllMocks()
        dbStore.Lesson = {}
    })

    describe('markLessonAsConcluded', () => {
        it('should update the lesson document with concluded: true', async () => {
            const lessonId = 'lesson-to-conclude'

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

            const result = await markLessonAsConcluded(lessonId)

            expect(result).toBe(true)

            expect(mockUpdateDoc).toHaveBeenCalledTimes(1)

            expect(mockUpdateDoc).toHaveBeenCalledWith(
                expect.objectContaining({ _path: `Lesson/${lessonId}` }),
                { concluded: true }
            )

            expect(dbStore.Lesson[lessonId].concluded).toBe(true)
        })

        it('should return false if lessonId is not provided', async () => {
            const result = await markLessonAsConcluded('')

            expect(result).toBe(false)
            expect(mockUpdateDoc).not.toHaveBeenCalled()
        })
    })
})
