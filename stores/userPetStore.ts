import { create } from 'zustand'
import { getUserWithPetByEmail, updateUser } from '@/services/userService'
import { updatePet } from '@/services/petService'
import { Pet } from '@/dtos/Pet'
import User from '@/dtos/User'
import { CheckAchievementLevel, CheckAchievementMoney, getAchievementByName } from '@/utils/AchievementHelper'
import { showToast } from '@/utils/Toast'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig'

interface UserPetState {
    [x: string]: any
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
    setPet: (pet: Pet | null) => void
    setAchievements: (achievements: string) => void
    updateAchievements: (achievement: string, title: string, content: string) => Promise<void>
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
        set({ loading: true, error: null })
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
    setPet: (pet: Pet | null) => set({ pet }),

    updateAchievements: async (achievementId, title, content) => {
    const user = get().user
    if (!user) {
      set({ error: 'User not found', loading: false })
      return
    }
    if (user.achievements.includes(achievementId)) {
      set({ loading: false })
      return
    }

    set({ loading: true, error: null })

    try {
      const userRef = doc(db, 'User', user.id)
      await updateDoc(userRef, {
        achievements: arrayUnion(achievementId)
      })

      const newAchievements = [...user.achievements, achievementId]
      set({ user: { ...user, achievements: newAchievements } })

      showToast(`${title}: ${content}`, 'success')
    } catch (err: any) {
      set({ error: err.message })
    } finally {
      set({ loading: false })
    }
  },
}))
