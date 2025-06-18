import { create } from 'zustand'
import { getUserWithPetByEmail, updateUser } from '@/services/userService'
import { updatePet } from '@/services/petService'
import { Pet } from '@/dtos/Pet'
import User from '@/dtos/User'

interface UserPetState {
    user: User | null
    pet: Pet | null
    loading: boolean
    error: string | null
    itemsAdapter: {
        bed?: string
        food?: string
        wc?: string
        toy?: string
        floor?: string
        wallpaper?: string
        water?: string
    }
    fetchUserAndPetByEmail: (userEmail: string) => Promise<void>
    updateUser: (userId: string, userData: Partial<User>) => Promise<void>
    updatePet: (petId: string, petData: Partial<Pet>) => Promise<void>
    updatePetItens: (petId: string, petData: Partial<Pet>) => Promise<void>
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
    setAchievements(achievements) {},
    itemsAdapter: {},

    fetchUserAndPetByEmail: async (userEmail: string) => {
        set({ loading: true, error: null })
        try {
            const result = await getUserWithPetByEmail(userEmail)
            if (result) {
                const activeItemsWithImages = Object.fromEntries(
                    Object.entries(result.pet.activeItems).map(
                        ([slot, itemId]) => {
                            const purchase = result.pet.purchasedItems.find(
                                (pi) => pi.itemId === itemId
                            )
                            const image = purchase ? purchase.image : ''
                            return [slot, image]
                        }
                    )
                )

                set({
                    user: result.user,
                    pet: result.pet,
                    itemsAdapter: activeItemsWithImages,
                    loading: false,
                })
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
                    set({
                        pet: { ...oldPet, ...petData },
                    })
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

    updatePetItens: async (petId: string, petData: Partial<Pet>) => {
        set({ error: null })
        try {
            const success = await updatePet(petId, petData)
            if (success) {
                const newItems = petData.activeItems
                const oldPet = get().pet
                const activeItemsWithImages = Object.fromEntries(
                    Object.entries(newItems).map(([slot, itemId]) => {
                        const purchase = oldPet?.purchasedItems.find(
                            (pi) => pi.itemId === itemId
                        )
                        const image = purchase ? purchase.image : null
                        return [slot, image]
                    })
                )

                if (oldPet) {
                    set({
                        pet: { ...oldPet, ...petData },
                        itemsAdapter: activeItemsWithImages,
                    })
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

            if (!user) {
                throw new Error('Usuário não encontrado')
            }

            const alreadyOwned = user.achievements.includes(achievement)
            if (!alreadyOwned) {
                const newAchievements = [...user.achievements, achievement]
                await get().updateUser(user.id, {
                    achievements: newAchievements,
                })
                set({ user: { ...user, achievements: newAchievements } })
            }
        } catch (error: any) {
            set({ error: error.message })
        } finally {
            set({ loading: false })
        }
    },
}))
