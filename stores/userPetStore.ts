import { create } from 'zustand'
import { getUserWithPetByEmail, updateUser } from '@/services/userService'
import { updatePet } from '@/services/petService'
import { Pet } from '@/dtos/Pet'
import User from '@/dtos/User'
import { CheckAchievementLevel, CheckAchievementMoney, getAchievementByName } from '@/utils/AchievementHelper'
import { showToast } from '@/utils/Toast'

interface UserPetState {
    user: User | null
    pet: Pet | null
    loading: boolean
    error: string | null
    fetchUserAndPetByEmail: (userEmail: string) => Promise<void>
    updateUser: (userId: string, userData: Partial<User>) => Promise<void>
    updatePet: (petId: string, petData: Partial<Pet>) => Promise<void>
    setUser: (user: User) => void
    setPet: (pet: Pet) => void
    setAchievements: (achievements: string) => void
    updateAchievements: (achievement: string, title: string, content: string) => Promise<void>
}

export const useUserPetStore = create<UserPetState>((set, get) => ({
    user: null,
    pet: null,
    loading: true,
    error: null,
    setAchievements(achievements) {

    },

    fetchUserAndPetByEmail: async (userEmail: string) => {
        set({ loading: true, error: null })
        try {
            const result = await getUserWithPetByEmail(userEmail)
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
            const success = await updateUser(userId, userData)
            if (success) {
                const oldUser = get().user
                if (oldUser) {
                    set({ user: { ...oldUser, ...userData } })            
                    CheckAchievementLevel(oldUser.level, userData.level);
                    CheckAchievementMoney(oldUser.money, userData.money || oldUser.money);     
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
            const success = await updatePet(petId, petData)
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

    updateAchievements: async (achievement: string, title: string, content: string) => {
        set({ error: null })
        try {
            const user = get().user
            if (user) {
                const alreadyOwned = user.achievements.includes(achievement)
                if (!alreadyOwned) {
                    const newAchievements = [...user.achievements, achievement]
                    console.log(`Updating achievements for user ${user.id}:`, newAchievements)
                    await get().updateUser(user.id, { achievements: newAchievements})
                    set({ user: { ...user, achievements: newAchievements}})

                     setTimeout(() => {
                        showToast(title + ': ' + content, 'success' );
                    }, 100);
                }
            }
        } catch (error: any) {
            set({ error: error.message })
        } finally {
            set({ loading: false })
        }
    },
}))
