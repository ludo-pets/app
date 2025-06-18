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
        foodBowl?: string
    }
    fetchUserAndPetByEmail: (userEmail: string) => Promise<void>
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
    setAchievements(achievements) {},
    itemsAdapter: {},

    fetchUserAndPetByEmail: async (userEmail: string) => {
        set({ loading: true, error: null })
        try {
            const result = await getUserWithPetByEmail(userEmail)
            if (result) {
                const itemsMapped = [
                    'bed',
                    'food',
                    'wc',
                    'toy',
                    'floor',
                    'wallpaper',
                    'water',
                    'foodBowl',
                ].reduce((acc, item) => {
                    const itemId =
                        result.pet.activeItems[
                            item as keyof typeof result.pet.activeItems
                        ]
                    const itemDetails = result.pet.purchasedItems.find(
                        (purchasedItem) => purchasedItem.itemId === itemId
                    )

                    if (itemDetails && 'image' in itemDetails) {
                        acc[item as keyof typeof acc] = (
                            itemDetails as { image: string }
                        ).image
                    }
                    return acc
                }, {} as { [key in 'bed' | 'food' | 'wc' | 'toy' | 'floor' | 'wallpaper' | 'water' | 'foodBowl']?: string })

                set({
                    user: result.user,
                    pet: result.pet,
                    itemsAdapter: itemsMapped,
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
                const itemsMapped = [
                    'bed',
                    'food',
                    'wc',
                    'toy',
                    'floor',
                    'wallpaper',
                    'water',
                    'foodBowl',
                ].reduce((acc, item) => {
                    const itemId =
                        petData.activeItems?.[
                            item as keyof typeof petData.activeItems
                        ]
                    const itemDetails = petData.purchasedItems?.find(
                        (purchasedItem) => purchasedItem.itemId === itemId
                    )

                    if (itemDetails && 'image' in itemDetails) {
                        acc[
                            item as
                                | 'bed'
                                | 'food'
                                | 'wc'
                                | 'toy'
                                | 'floor'
                                | 'wallpaper'
                                | 'water'
                                | 'foodBowl'
                        ] = (itemDetails as { image: string }).image
                    } else {
                        acc[
                            item as
                                | 'bed'
                                | 'food'
                                | 'wc'
                                | 'toy'
                                | 'floor'
                                | 'wallpaper'
                                | 'water'
                                | 'foodBowl'
                        ] =
                            get().itemsAdapter[
                                item as
                                    | 'bed'
                                    | 'food'
                                    | 'wc'
                                    | 'toy'
                                    | 'floor'
                                    | 'wallpaper'
                                    | 'water'
                                    | 'foodBowl'
                            ] ?? ''
                    }
                    return acc
                }, {} as { [key in 'bed' | 'food' | 'wc' | 'toy' | 'floor' | 'wallpaper' | 'water' | 'foodBowl']?: string })

                const oldPet = get().pet
                if (oldPet) {
                    set({
                        pet: { ...oldPet, ...petData },
                        itemsAdapter: itemsMapped,
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
