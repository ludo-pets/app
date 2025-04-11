import { create } from 'zustand'
import Minigame from '@/dtos/Minigame'
import { getMinigameByIdService } from '@/services/minigameService'
import Lesson from '@/dtos/Lesson'

interface LessonsState {
    lessons: Array<Lesson> | null
    loading: boolean
    error: string | null
    fetchMinigame: (minigameId: string) => Promise<void>
    setMinigame: (minigame: Minigame) => void
}

export const useMinigameStore = create<MinigameState>((set) => ({
    minigame: null,
    loading: false,
    error: null,

    fetchMinigame: async (minigameId: string) => {
        set({ loading: true, error: null })
        try {
            const result = await getMinigameByIdService(minigameId)
            if (result) {
                set({ minigame: result.minigame, loading: false })
            } else {
                set({ error: 'Minigame não encontrado', loading: false })
            }
        } catch (error: any) {
            set({ error: error.message, loading: false })
        }
    },

    setMinigame: (minigame: Minigame) => set({ minigame }),
}))
