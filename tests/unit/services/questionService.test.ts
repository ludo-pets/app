import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import {
    fetchAllQuestionsService,
    fetchQuestionById,
} from '@/services/questionService'

jest.mock('@/firebaseConfig', () => ({
    db: {},
}))

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
}))

const mockGetDocs = getDocs as jest.Mock
const mockGetDoc = getDoc as jest.Mock
const mockCollection = collection as jest.Mock
const mockDoc = doc as jest.Mock

describe('QuestionService', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('fetchAllQuestionsService', () => {
        it('should return an object with questions on successful fetch', async () => {
            const mockData = [
                {
                    id: 'q1',
                    title: 'What is 2+2?',
                    rightAnswer: 4,
                    answers: ['1', '2', '3', '4'],
                    description: 'A simple math question',
                    explanation: '2+2 equals 4',
                },
                { id: 'q2', rightAnswer: 1 },
            ]
            const mockDocs = mockData.map((q) => ({
                id: q.id,
                data: () => q,
            }))
            mockGetDocs.mockResolvedValue({ docs: mockDocs })

            const result = await fetchAllQuestionsService()

            expect(result).not.toBeNull()
            expect(result?.questions).toHaveLength(2)
            expect(result?.questions[0].title).toBe('What is 2+2?')
            expect(result?.questions[1].title).toBe('Untitled Question')
        })

        it('should return an object with an empty questions array if none are found', async () => {
            mockGetDocs.mockResolvedValue({ docs: [] })
            const result = await fetchAllQuestionsService()
            expect(result).not.toBeNull()
            expect(result?.questions).toEqual([])
        })

        it('should throw an error if fetching fails', async () => {
            const firestoreError = new Error('Firestore error')
            mockGetDocs.mockRejectedValue(firestoreError)

            await expect(fetchAllQuestionsService()).rejects.toThrow(
                'Failed to fetch quiz questions.'
            )
        })
    })

    describe('fetchQuestionById', () => {
        it('should return a question when found with all fields', async () => {
            const mockQuestionData = {
                title: 'Specific Question',
                rightAnswer: 1,
                answers: ['A', 'B'],
                description: 'A specific description',
                explanation: 'A specific explanation',
            }
            mockGetDoc.mockResolvedValue({
                id: 'q1',
                exists: () => true,
                data: () => mockQuestionData,
            })

            const result = await fetchQuestionById('q1')

            expect(result.id).toBe('q1')
            expect(result.title).toBe('Specific Question')
            expect(result.explanation).toBe('A specific explanation')
        })

        it('should return a question with default values for missing fields', async () => {
            const mockQuestionData = { rightAnswer: 3 }
            mockGetDoc.mockResolvedValue({
                id: 'q2',
                exists: () => true,
                data: () => mockQuestionData,
            })

            const result = await fetchQuestionById('q2')

            expect(result.id).toBe('q2')
            expect(result.title).toBe('Untitled Question')
            expect(result.description).toBe('No description')
            expect(result.explanation).toBe('No explanation')
            expect(result.answers).toEqual([])
        })

        it('should throw correct error when question does not exist', async () => {
            mockGetDoc.mockResolvedValue({ exists: () => false })
            const questionId = 'nonexistent'

            await expect(fetchQuestionById(questionId)).rejects.toThrow(
                'Failed to fetch the question.'
            )
        })

        it('should re-throw a generic error on direct fetch failure', async () => {
            const error = new Error('Firestore getDoc error')
            mockGetDoc.mockRejectedValue(error)
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {})

            await expect(fetchQuestionById('q1')).rejects.toThrow(
                'Failed to fetch the question.'
            )
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Error fetching question:',
                error
            )

            consoleErrorSpy.mockRestore()
        })
    })
})
