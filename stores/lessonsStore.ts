import { create } from 'zustand'
import Lesson from '@/dtos/Lesson'
import { getAllLessons } from '@/services/lessonService'

interface LessonsState {
    lessons: Array<Lesson> | null
    loading: boolean
    error: string | null
    fetchLessons: () => Promise<void>
    setLessons: (lessons: Array<Lesson>) => void
}

export const useLessonsState = create<LessonsState>((set) => ({
    lessons: null,
    loading: false,
    error: null,
  
    fetchLessons: async () => {
      set({ loading: true, error: null })
      try {
        const result = await getAllLessons()
        if (result?.lessons) {
          set({ lessons: result.lessons, loading: false })
        } else {
          set({ error: 'Nenhuma lição encontrada', loading: false })
        }
      } catch (error: any) {
        set({ error: error.message, loading: false })
      }
    },
  
    setLessons: (lessons: Array<Lesson>) => set({ lessons })
  }))