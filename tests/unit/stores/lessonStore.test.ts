import { act } from '@testing-library/react-native'
import { getLessonByIdService } from '@/services/lessonService'
import { fetchQuestion } from '@/services/questionsService'
import Lesson from '@/dtos/Lesson'
import Question from '@/dtos/Question'
import { useLessonStore } from '@/stores/lessonStore'

jest.mock('@/services/lessonService', () => ({
    getLessonByIdService: jest.fn(),
}))
jest.mock('@/services/questionsService', () => ({
    fetchQuestion: jest.fn(),
}))

const mockedGetLessonByIdService = getLessonByIdService as jest.Mock
const mockedFetchQuestion = fetchQuestion as jest.Mock

const mockLesson: Lesson = {
    id: 'lesson1',
    name: 'Lesson 1',
    questions: ['q1', 'q2'],
    givenExperience: 100,
    givenMoney: 50,
    icon: 'icon1.png',
    order: 1,
}

const mockQuestion: Question = {
    id: 'q1',
    title: 'Question 1',
    answers: ['Answer 1', 'Answer 2', 'Answer 3'],
    rightAnswer: 0,
    explanation: 'Explanation for question 1',
    image: 'image1.png',
    description: 'Description for question 1',
}

describe('useLessonStore', () => {
    beforeEach(() => {
        act(() => {
            useLessonStore.setState({
                lesson: null,
                loading: true,
                error: null,
                currentQuestion: null,
            })
        })
        jest.clearAllMocks()
    })

    describe('fetchLesson', () => {
        const lessonId = 'lesson1'

        it('should fetch a lesson and update state on success', async () => {
            mockedGetLessonByIdService.mockResolvedValue({ lesson: mockLesson })
            await useLessonStore.getState().fetchLesson(lessonId)
            const { lesson, loading, error } = useLessonStore.getState()
            expect(loading).toBe(false)
            expect(error).toBeNull()
            expect(lesson).toEqual(mockLesson)
        })

        it('should set an error if the lesson is not found', async () => {
            mockedGetLessonByIdService.mockResolvedValue(null)
            await useLessonStore.getState().fetchLesson(lessonId)
            const { lesson, loading, error } = useLessonStore.getState()
            expect(loading).toBe(false)
            expect(error).toBe(
                `Nenhuma lição encontrada a partir do id '${lessonId}'`
            )
            expect(lesson).toBeNull()
        })

        it('should set an error if the service throws', async () => {
            const errorMessage = 'Service unavailable'
            mockedGetLessonByIdService.mockRejectedValue(
                new Error(errorMessage)
            )
            await useLessonStore.getState().fetchLesson(lessonId)
            const { lesson, loading, error } = useLessonStore.getState()
            expect(loading).toBe(false)
            expect(error).toBe(errorMessage)
            expect(lesson).toBeNull()
        })
    })

    describe('changeToNextQuestion', () => {
        const questionList = ['q1', 'q2']

        it('should fetch the first question if current is null', async () => {
            mockedFetchQuestion.mockResolvedValue(mockQuestion)
            const result = await useLessonStore
                .getState()
                .changeToNextQuestion(null, questionList)
            const { currentQuestion } = useLessonStore.getState()
            expect(result).toBe(true)
            expect(mockedFetchQuestion).toHaveBeenCalledWith('q1')
            expect(currentQuestion).toEqual(mockQuestion)
        })

        it('should fetch the next question in the list', async () => {
            const nextQuestion = { ...mockQuestion, id: 'q2' }
            mockedFetchQuestion.mockResolvedValue(nextQuestion)
            const result = await useLessonStore
                .getState()
                .changeToNextQuestion('q1', questionList)
            const { currentQuestion } = useLessonStore.getState()
            expect(result).toBe(true)
            expect(mockedFetchQuestion).toHaveBeenCalledWith('q2')
            expect(currentQuestion).toEqual(nextQuestion)
        })

        it('should return false if current question is the last one', async () => {
            const result = await useLessonStore
                .getState()
                .changeToNextQuestion('q2', questionList)
            expect(result).toBe(false)
            expect(mockedFetchQuestion).not.toHaveBeenCalled()
        })
    })

    describe('finishLesson', () => {
        it('should clear the current question and update the lesson state', async () => {
            act(() => {
                useLessonStore.setState({
                    lesson: mockLesson,
                    currentQuestion: mockQuestion,
                    loading: false,
                    error: 'some error',
                })
            })

            await useLessonStore.getState().finishLesson(mockLesson)

            const { lesson, currentQuestion, loading, error } =
                useLessonStore.getState()
            expect(lesson).toEqual(mockLesson)
            expect(currentQuestion).toBeNull()
            expect(loading).toBe(false)
            expect(error).toBeNull()
        })

        it('should handle errors when finishing a lesson and set an error state', async () => {
            await useLessonStore.getState().finishLesson(null as any);

            const { error } = useLessonStore.getState();

            expect(error).toEqual(expect.any(String));
        });
    })

    describe('setLesson', () => {
        it('should correctly set the lesson in the state', () => {
            act(() => {
                useLessonStore.getState().setLesson(mockLesson)
            })

            const { lesson, loading } = useLessonStore.getState()
            expect(lesson).toEqual(mockLesson)
            expect(loading).toBe(false)
        })
    })
})
