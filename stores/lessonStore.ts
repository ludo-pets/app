import { create } from 'zustand'
import Lesson from '@/dtos/Lesson'
import { getLessonByIdService, markLessonAsConcluded } from '@/services/lessonService'
import Question from '@/dtos/Question'
import { fetchQuestion } from '@/services/questionService'

interface LessonState {
    lesson: Lesson | null
    loading: boolean
    error: string | null
    currentQuestion: Question | null
    fetchLesson: (lessonId: string) => Promise<void>
    setLesson: (lesson: Lesson) => void
    finishLesson: (lesson: Lesson) => Promise<void>
    changeToNextQuestion: (
        currentQuestionId: string | null,
        questionList: string[]
    ) => Promise<boolean>
}

export const useLessonStore = create<LessonState>((set) => ({
    lesson: null,
    loading: true,
    error: null,
    currentQuestion: null,

    fetchLesson: async (lessonId: string) => {
        set({ loading: true, error: null })
        try {
            const result = await getLessonByIdService(lessonId)
            if (result) {
                set({ lesson: result.lesson, loading: false })
            } else {
                set({
                    error: `Nenhuma lição encontrada a partir do id '${lessonId}'`,
                    loading: false,
                })
            }
        } catch (error: any) {
            set({ error: error.message, loading: false })
        } finally {
            set({ loading: false })
        }
    },

    setLesson: (lesson: Lesson) => set({ lesson, loading: false }),

    finishLesson: async (lesson: Lesson) => {
        set({ loading: true, error: null })
        try {
            set({
                lesson: {
                    ...lesson,
                },
                loading: false,
                currentQuestion: null,
                error: null,
            })
        } catch (error: any) {            
            set({ error: error.message, loading: false })
        } finally {
            set({ loading: false })
        }
    },

    changeToNextQuestion: async (
        currentQuestionId: string | null,
        questionList: string[]
    ) => {
        let nextQuestionId
        if (currentQuestionId === null) {
            nextQuestionId = questionList[0]
        } else {
            const currentQuestionIdIndex =
                questionList.indexOf(currentQuestionId)
            if (currentQuestionIdIndex === questionList.length - 1) {
                return false
            }
            nextQuestionId = questionList[currentQuestionIdIndex + 1]
        }
        const nextQuestion = await fetchQuestion(nextQuestionId)
        set({ currentQuestion: nextQuestion, loading: false })
        return true
    },
}))
