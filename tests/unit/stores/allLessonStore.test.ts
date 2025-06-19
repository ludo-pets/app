import { getAllLessonsService } from '@/services/lessonService'
import Lesson from '@/dtos/Lesson'
import { useAllLessonsStore } from '@/stores/allLessonsStore'
import { act } from '@testing-library/react-native'

jest.mock('@/services/lessonService', () => ({
    getAllLessonsService: jest.fn(),
}))

const mockedGetAllLessonsService = getAllLessonsService as jest.Mock

const mockLessons: Lesson[] = [
    {
        id: '1',
        name: 'Lesson 1',
        questions: ['q1', 'q2', 'q3'],
        givenExperience: 100,
        givenMoney: 50,
        icon: 'icon1.png',
        order: 1,
    },
    {
        id: '2',
        name: 'Lesson 2',
        questions: ['q4', 'q5', 'q6'],
        givenExperience: 200,
        givenMoney: 100,
        icon: 'icon2.png',
        order: 2,
    },
]

describe('useAllLessonsStore', () => {
    beforeEach(() => {
        act(() => {
            useAllLessonsStore.setState({
                lessons: null,
                loading: false,
                error: null,
            })
        })
        jest.clearAllMocks()
    })

    it('should have a correct initial state', () => {
        const { lessons, loading, error } = useAllLessonsStore.getState()
        expect(lessons).toBeNull()
        expect(loading).toBe(false)
        expect(error).toBeNull()
    })

    describe('fetchAllLessons', () => {
        it('should fetch lessons and update state on success', async () => {
            mockedGetAllLessonsService.mockResolvedValue({
                lessons: mockLessons,
            })

            await useAllLessonsStore.getState().fetchAllLessons()

            const { lessons, loading, error } = useAllLessonsStore.getState()
            expect(loading).toBe(false)
            expect(error).toBeNull()
            expect(lessons).toEqual(mockLessons)
            expect(mockedGetAllLessonsService).toHaveBeenCalledTimes(1)
        })

        it('should set an error message if service returns no lessons', async () => {
            mockedGetAllLessonsService.mockResolvedValue({ lessons: null })

            await useAllLessonsStore.getState().fetchAllLessons()

            const { lessons, loading, error } = useAllLessonsStore.getState()
            expect(loading).toBe(false)
            expect(error).toBe('Lições não encontradas')
            expect(lessons).toBeNull()
        })

        it('should set an error message if the service throws an error', async () => {
            const errorMessage = 'Network error'
            mockedGetAllLessonsService.mockRejectedValue(
                new Error(errorMessage)
            )

            await useAllLessonsStore.getState().fetchAllLessons()

            const { lessons, loading, error } = useAllLessonsStore.getState()
            expect(loading).toBe(false)
            expect(error).toBe(errorMessage)
            expect(lessons).toBeNull()
        })
    })

    describe('setLessons', () => {
        it('should correctly set the lessons in the state', () => {
            act(() => {
                useAllLessonsStore.getState().setLessons(mockLessons)
            })

            const { lessons } = useAllLessonsStore.getState()
            expect(lessons).toEqual(mockLessons)
        })
    })
})
