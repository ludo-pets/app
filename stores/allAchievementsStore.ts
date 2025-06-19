import { create } from 'zustand'
import Achievement from '@/dtos/Achievement'
import { fetchAchievements } from '@/services/achievementService';

interface AllAchievementsStore {
    achievements: Achievement[] | null
    loading: boolean
    error: string | null
    fetchAllAchievements: () => Promise<void>
    setAchievements: (achievements: Achievement[]) => void
}

export const useAllAchievementsStore = create<AllAchievementsStore>((set) => ({
    achievements: null,
    loading: false,
    error: null,

    fetchAllAchievements: async () => {
        set({ loading: true, error: null })
        try {
            const result = await fetchAchievements()
            if (result) {
                set({ achievements: result, loading: false })
            } else {
                set({ error: 'Achievements não encontrados', loading: false })
            }
        } catch (error: any) {
            set({ error: error.message, loading: false })
        } finally {
            set({ loading: false })
        }
    },

    setAchievements: (achievements: Achievement[]) => set({ achievements }),
}))