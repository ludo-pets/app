import { create } from 'zustand'
import Lesson from '@/dtos/Lesson'
import { getAllLessonsService } from '@/services/lessonService'

interface AllLessonsState {
    lessons: Array<Lesson> | null
    loading: boolean
    error: string | null
    fetchAllLessons: () => Promise<void>
    setLessons: (lessons: Array<Lesson>) => void
}

export const useAllLessonsStore = create<AllLessonsState>((set) => ({
    lessons: null,
    loading: false,
    error: null,

    fetchAllLessons: async () => {
        set({ loading: true, error: null })
        try {
            const result = await getAllLessonsService()
            if (result?.lessons) {
                set({ lessons: result.lessons, loading: false })
            } else {
                set({ error: 'Lições não encontradas', loading: false })
            }
        } catch (error: any) {
            set({ error: error.message, loading: false })
        }
    },

    setLessons: (lessons: Array<Lesson>) => set({ lessons }),
}))
