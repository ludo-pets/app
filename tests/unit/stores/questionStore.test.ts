import { act } from '@testing-library/react-native'
import { fetchAllQuestionsService } from '@/services/questionsService'
import Question from '@/dtos/Question'
import { useQuestionsStore } from '@/stores/questionsStore'

jest.mock('@/services/questionsService', () => ({
    fetchAllQuestionsService: jest.fn(),
}))

const mockedFetchAllQuestionsService = fetchAllQuestionsService as jest.Mock

const mockQuestions: Question[] = [
    {
        id: 'q1',
        title: 'Q1',
        answers: ['A1', 'A2', 'A3'],
        rightAnswer: 0,
        explanation: 'Some explanation for Q1',
        image: 'https://example.com/image1.png',
        description: 'Description for Q1',
    },
    {
        id: 'q2',
        title: 'Q2',
        answers: ['A1', 'A2', 'A3'],
        rightAnswer: 2,
        explanation: 'Some explanation for Q2',
        image: 'https://example.com/image2.png',
        description: 'Description for Q2',
    },
]

describe('useQuestionsStore', () => {
    beforeEach(() => {
        act(() => {
            useQuestionsStore.setState({
                questions: [],
                loading: false,
                error: null,
            })
        })
        jest.clearAllMocks()
    })

    describe('fetchQuestions', () => {
        it('should fetch questions and update state on success', async () => {
            mockedFetchAllQuestionsService.mockResolvedValue({
                questions: mockQuestions,
            })

            await useQuestionsStore.getState().fetchQuestions()

            const { questions, loading, error } = useQuestionsStore.getState()
            expect(loading).toBe(false)
            expect(error).toBeNull()
            expect(questions).toEqual(mockQuestions)
        })

        it('should set an error if service returns a falsy value', async () => {
            mockedFetchAllQuestionsService.mockResolvedValue(null)

            await useQuestionsStore.getState().fetchQuestions()

            const { questions, loading, error } = useQuestionsStore.getState()
            expect(loading).toBe(false)
            expect(error).toBe('Questões não encontradas')
            expect(questions).toEqual([])
        })

        it('should set a specific error message if the service throws an error with a message', async () => {
            const errorMessage = 'Failed to fetch'
            mockedFetchAllQuestionsService.mockRejectedValue(
                new Error(errorMessage)
            )

            await useQuestionsStore.getState().fetchQuestions()

            const { questions, loading, error } = useQuestionsStore.getState()
            expect(loading).toBe(false)
            expect(error).toBe(errorMessage)
            expect(questions).toEqual([])
        })

        it('should set a generic error message if the service throws an error without a message', async () => {
            mockedFetchAllQuestionsService.mockRejectedValue({})

            await useQuestionsStore.getState().fetchQuestions()

            const { loading, error } = useQuestionsStore.getState()
            expect(loading).toBe(false)
            expect(error).toBe('Erro ao buscar questões')
        })
    })

    describe('setQuestions', () => {
        it('should correctly set the questions in the state', () => {
            act(() => {
                useQuestionsStore.getState().setQuestions(mockQuestions)
            })

            const { questions } = useQuestionsStore.getState()
            expect(questions).toEqual(mockQuestions)
        })
    })
})
