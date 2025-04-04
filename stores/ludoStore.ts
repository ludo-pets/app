import { create } from 'zustand'
import { IUser } from '@/dtos/IUser'
import { IPet } from '@/dtos/IPet'
import {
    getUserWithPetByIdService,
    updateUserService,
} from '@/services/userService'
import { updatePetService } from '@/services/petService'

interface UserPetState {
    user: IUser | null
    pet: IPet | null
    loading: boolean
    error: string | null
    fetchUserAndPet: (userId: string) => Promise<void>
    updateUser: (userId: string, userData: Partial<IUser>) => Promise<void>
    updatePet: (petId: string, petData: Partial<IPet>) => Promise<void>
    setUser: (user: IUser) => void
    setPet: (pet: IPet) => void
}

export const useUserPetStore = create<UserPetState>((set, get) => ({
    user: null,
    pet: null,
    loading: false,
    error: null,

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

    updateUser: async (userId: string, userData: Partial<IUser>) => {
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

    updatePet: async (petId: string, petData: Partial<IPet>) => {
        set({ loading: true, error: null })
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

    setUser: (user: IUser) => set({ user }),
    setPet: (pet: IPet) => set({ pet }),
}))
