import { create } from 'zustand'
import { IUser } from '@/dtos/IUser'
import { getUserByIdService, updateUserService } from '@/services/userService'

// Definição da interface do estado
interface UserState {
    user: IUser | null
    loading: boolean
    error: string | null
    fetchUser: (userId: string) => Promise<void>
    updateUser: (userId: string, userData: Partial<IUser>) => Promise<void>
    setUser: (user: IUser) => void
}

export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    loading: false,
    error: null,
    fetchUser: async (userId: string) => {
        set({ loading: true, error: null })
        try {
            const userData = await getUserByIdService(userId)
            if (userData) {
                set({ user: userData, loading: false })
            } else {
                set({ error: 'User não encontrado', loading: false })
            }
        } catch (error: any) {
            set({ error: error.message, loading: false })
        }
    },
    updateUser: async (userId: string, userData: Partial<IUser>) => {
        set({ loading: true, error: null })
        try {
            const newUser = await updateUserService(userId, userData)
            const oldUser = get().user
            if (oldUser && newUser) {
                set({
                    user: {
                        ...oldUser,
                        ...userData,
                    },
                    loading: false,
                })
            } else {
                set({
                    error: 'User não encontrado ou erro ao atualizaro user',
                    loading: false,
                })
            }
        } catch (error: any) {
            set({ error: error.message, loading: false })
        }
    },
    setUser: (user: IUser) => set({ user }),
}))
