import { create } from 'zustand'
import Lesson from '@/dtos/Lesson'
import { getAllLessons, getLessonByIdService } from '@/services/lessonService'

interface LessonState {
    lesson: Lesson | null
    loading: boolean
    error: string | null
    fetchLesson: (lessonId: string) => Promise<void>
    setLesson: (lesson: Lesson) => void
}

export const useLessonState = create<LessonState>((set) => ({
    fetchLesson: null,
    loading: false,
    error: null,
  
    fetchLesson: async (lessonId: string) => {
      set({ loading: true, error: null })
      try {
        const result = await getLessonByIdService(lessonId)
        if (result) {
          set({ lessons: result.lesson, loading: false })
        } else {
          set({ error: 'Nenhuma lição encontrada', loading: false })
        }
      } catch (error: any) {
        set({ error: error.message, loading: false })
      }
    },
  
    setLessons: (lesson: Lesson) => set({ lessons })
  }))