import { create } from 'zustand'
import Lesson from '@/dtos/Lesson'
import { getLessonByIdService } from '@/services/lessonService'

interface LessonState {
    lesson: Lesson | null
    loading: boolean
    error: string | null
    fetchLesson: (lessonId: string) => Promise<void>
    setLesson: (lesson: Lesson) => void
}

export const useLessonStore = create<LessonState>((set) => ({
    lesson: null,
    loading: false,
    error: null,

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
        }
    },

    setLesson: (lesson: Lesson) => set({ lesson }),
}))
