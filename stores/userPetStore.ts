import { create } from 'zustand'
import User from '@/dtos/User'
import { Pet } from '@/dtos/Pet'
import {
    getUserWithPetByIdService,
    updateUserService,
} from '@/services/userService'
import { updatePetService } from '@/services/petService'

interface UserPetState {
    user: User | null
    pet: Pet | null
    loading: boolean
    error: string | null
    fetchUserAndPet: (userId: string) => Promise<void>
    updateUser: (userId: string, userData: Partial<User>) => Promise<void>
    updatePet: (petId: string, petData: Partial<Pet>) => Promise<void>
    setUser: (user: User) => void
    setPet: (pet: Pet) => void
    setAchievements: (achievements: string) => void
    updateAchievements: (achievements: string) => Promise<void>
}

export const useUserPetStore = create<UserPetState>((set, get) => ({
    user: null,
    pet: null,
    loading: true,
    error: null,
    setAchievements(achievements) {

    },

    fetchUserAndPet: async (userId: string) => {
        set({ loading: true, error: null })
        try {
            const result = await getUserWithPetByIdService(userId)
            if (result) {
                set({ user: result.user, pet: result.pet, loading: false })
            } else {
                set({ error: 'User ou Pet não encontrado', loading: false })
            }
        } catch (error: any) {
            set({ error: error.message, loading: false })
        }
    },

    updateUser: async (userId: string, userData: Partial<User>) => {
        set({ loading: true, error: null })
        try {
            const success = await updateUserService(userId, userData)
            if (success) {
                const oldUser = get().user
                if (oldUser) {
                    set({ user: { ...oldUser, ...userData } })
                }
            } else {
                set({ error: 'Erro ao atualizar o usuário' })
            }
        } catch (error: any) {
            set({ error: error.message })
        } finally {
            set({ loading: false })
        }
    },

    updatePet: async (petId: string, petData: Partial<Pet>) => {
        set({ error: null })
        try {
            const success = await updatePetService(petId, petData)
            if (success) {
                const oldPet = get().pet
                if (oldPet) {
                    set({ pet: { ...oldPet, ...petData } })
                }
            } else {
                set({ error: 'Erro ao atualizar o pet' })
            }
        } catch (error: any) {
            set({ error: error.message })
        } finally {
            set({ loading: false })
        }
    },

    setUser: (user: User) => set({ user }),
    setPet: (pet: Pet) => set({ pet }),

    updateAchievements: async (achievement: string) => {
        set({ error: null })
        try {
            const user = get().user
            if (user) {
                const alreadyOwned = user.achievements.includes(achievement)
                if (!alreadyOwned) {
                    const newAchievements = [...user.achievements, achievement]
                    await updateUserService(user.id, { achievements: newAchievements, experience: user.experience + 1 })
                    set({ user: { ...user, achievements: newAchievements, experience: user.experience + 1 } })
                }
            }
        } catch (error: any) {
            set({ error: error.message })
        } finally {
            set({ loading: false })
        }
    },
}))